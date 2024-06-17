import {
  appState, dispatch
} from "./global";
import {
  URLI,
  updateURL
} from "./url";
import {
  setLanguage,
} from "./language";
import {
  getTransitionModel
} from "./chart-transition";
import { loadJS, deepExtend, diffObject } from "./utils";
import timeLogger from "./timelogger";
import { observable, autorun, toJS, reaction } from "mobx";

let viz;
let urlUpdateDisposer;
const disposers = [];
const MAIN_MARKERS = ["bubble", "line", "bar", "mountain", "pyramid", "spreadsheet"];

//cleanup the existing tool
function removeTool() {
  if (viz) {
    viz.deconstruct();
    viz = void 0;
    let dispose;
    while (dispose = disposers.pop()) {
      dispose();
    }
    Vizabi.stores.markers.disposeAll();
  }
  d3.selectAll(".vzb-tool-config")
    .remove();
  d3.select(".vzb-placeholder")
    .remove();
}


function googleAnalyticsLoadEvents(viz) {
  const markers = viz.model.markers;
  const markerId = MAIN_MARKERS.find(id => markers[id]);
  const marker = markers[markerId];
  const splashMarker = viz.splashMarker;

  registerLoadFinish(marker, "FULL", !!splashMarker);

  function registerLoadFinish(loadMarker, id, splashed) {
    let splashReady = false;
    if (splashed) console.time("SPLASH");
    console.time(id);
    const dispose = reaction(
      () => {
        if (loadMarker.state != "fulfilled") return;
        return loadMarker.id;
      },
      () => {
        const logById = id => {
          console.timeEnd(id);
          const time = timeLogger.snapOnce(id);
          if (gtag && time) gtag("event", "timing_complete", {
            "name": id + " load",
            "value": time,
            "event_category": "Page load",
            "event_label": appState.tool
          });  
        }
        
        if (splashed && loadMarker.id.split("-").pop() == "splash") {
          splashReady = true;
          logById("SPLASH");
        } else {
          dispose();
          if (splashed && !splashReady) logById("SPLASH");
          logById(id);
        }
      },
      { name: id + " google load registration",
        onError: err => {
          console.log(err);
          window.Rollbar && Rollbar.critical(err);
        }
      }
    );
    disposers.push(dispose);
  }
}

function setTool(tool, skipTransition) {
  const toolset = toolsPage_toolset;
  const datasources = toolsPage_datasources;

  if (tool === appState.tool) return;
  if (!tool) tool = appState.tool;

  //configure google analytics with the active tool, which would be counted as a "page view" of our single-page-application
  if (gtag) gtag("config", poduction ? GAPMINDER_TOOLS_GA_ID_PROD : GAPMINDER_TOOLS_GA_ID_DEV, { "page_title": tool, "page_path": "/" + tool });

  const toolsetEntry = toolset.find(f => f.id === tool);
  const toolsetEntryPrevious = toolset.find(f => f.id === appState.tool);
  const toolModelPrevious = {}; //TODO: viz ? viz.getPersistentMinimalModel(VIZABI_PAGE_MODEL_PREVIOUS) : {};
  appState.tool = tool;

  //kill old autorun listener
  if (urlUpdateDisposer) urlUpdateDisposer();
  removeTool();

  timeLogger.removeAll();
  timeLogger.add("SPLASH");
  timeLogger.add("FULL");

  const tools = [toolsetEntry.tool];
  if (toolsetEntry.toolComponents) tools.push(...toolsetEntry.toolComponents);

  Promise.all(tools.map(tool => window[tool] ? Promise.resolve() : loadJS(tool.toLowerCase() + (ENV === "production" ? ".min.js" : ".js"), document.body))).then(() => {

    const pathToConfig = "config/toolconfigs/" + (toolsetEntry.config || toolsetEntry.tool) + ".js";
    loadJS(pathToConfig, document.body, "vzb-tool-config")
      .then(() => {
        d3.select(".vizabi-placeholder")
          .append("div")
          .attr("class", "vzb-placeholder")
          .attr("style", "width: 100%; height: 100%;");

        // apply data models from configuration to pageConfig
        function applyDataConfigs(pageConfig) {
          if (!pageConfig.model.dataSources) pageConfig.model.dataSources = {};
          const urlDataConfig = URLI.model?.model?.dataSources;

          if (urlDataConfig) {
            pageConfig.model.dataSources = urlDataConfig;
          } else {
            //bring data configs from a separate config file to the page config (those mentioned in toolset)

            const dataSourcesId = toolsetEntry.dataSources || Object.keys(datasources);
            dataSourcesId.forEach(ds => {
              if (!datasources[ds])
                console.warn(`Could not find data config with key ${ds} in datasources file`);
              else
                pageConfig.model.dataSources[ds] = datasources[ds];
              pageConfig.model.dataSources[ds].locale = URLI.model?.ui?.locale || pageConfig.ui.locale;
            });
          }

          //check if marker datasource is no longer among the configured datasources and kill marker config in that case
          //TODO: go deeper in encoding config and make it more granular
          const markers = pageConfig.model.markers;
          const markerId = MAIN_MARKERS.find(id => markers[id]);
          const datasourceIDs = Object.keys(pageConfig.model.dataSources);
          if (!datasourceIDs.includes(pageConfig.model.markers[markerId].data.source))
            pageConfig.model.markers = { [markerId]: { data: { source: datasourceIDs[0] } } };

          return pageConfig;
        }

        function applyTransitionConfigs(pageConfig) {
          if (skipTransition || !viz) return pageConfig;
          const transitionModel = getTransitionModel(toolModelPrevious, toolsetEntryPrevious.transition, toolsetEntry.transition);
          return deepExtend({}, pageConfig, transitionModel, true); //true --> overwrite by empty
        }

        const PLACEHOLDER = ".vzb-placeholder";

        window.VIZABI_PAGE_MODEL = deepExtend({
          ui: {
            layout: deepExtend({}, VizabiSharedComponents.LayoutService.DEFAULTS, {
              placeholder: PLACEHOLDER
            }),
            locale: deepExtend({}, VizabiSharedComponents.LocaleService.DEFAULTS, {
              placeholder: PLACEHOLDER,
              path: "assets/translation/"
            })
          }
        }, VIZABI_MODEL);
        let pageConfig = VIZABI_MODEL;
        pageConfig = applyDataConfigs(pageConfig);
        pageConfig = applyTransitionConfigs(pageConfig);
        if (URLI.model && URLI.model.model) {
          VizabiSharedComponents.Utils.mergeInTarget(pageConfig.model, deepExtend(URLI.model.model), /*treat as blocks:*/ ["data.filter"]);
        }
        window.VIZABI_UI_CONFIG = observable((URLI.model && URLI.model.ui) ? deepExtend({}, URLI.model.ui) : {});

        window.VIZABI_LOCALE = observable(VIZABI_PAGE_MODEL.ui.locale);
        if (VIZABI_UI_CONFIG.locale !== undefined) VIZABI_LOCALE.id = VIZABI_UI_CONFIG.locale;
        window.VIZABI_LAYOUT = observable(VIZABI_PAGE_MODEL.ui.layout);
        if (VIZABI_UI_CONFIG.projector !== undefined) VIZABI_LAYOUT.projector = VIZABI_UI_CONFIG.projector;

        setLanguage(VIZABI_LOCALE.id);
        dispatch.call("languageChanged", null, VIZABI_LOCALE.id);
        appState.projector = VIZABI_LAYOUT.projector;

        const toolPrototype = toolsetEntry.toolVariation ? window[toolsetEntry.tool][toolsetEntry.toolVariation] : window[toolsetEntry.tool];
        const model = Vizabi(pageConfig.model);

        const toolOptions = {
          showLoading: true
        };

        if (toolsetEntry.toolComponents) {
          toolOptions.toolComponents = toolsetEntry.toolComponents.map(toolComponent => window[toolComponent].Base);
        }

        viz = new toolPrototype({
          Vizabi,
          placeholder: PLACEHOLDER,
          model,
          locale: VIZABI_LOCALE,
          layout: VIZABI_LAYOUT,
          ui: VIZABI_UI_CONFIG,
          default_ui: VIZABI_PAGE_MODEL.ui,
          options: toolOptions
        });

        const switchDataSourceIfConceptNotFound = mobx.autorun(() => {
          //needed for the old URLs to work when switching to a different default data source
          if (viz.status === "fulfilled") {
            for (const marker in viz.model.markers) {
              if (!MAIN_MARKERS.includes(marker)) continue;
              for (const enc in viz.model.markers[marker].encoding) {
                const dataconfig = viz.model.markers[marker].encoding[enc].data;

                const hasConcept = (ds, c) => ds.getConcept(c).concept;

                const concept = dataconfig.config.concept;
                if (concept && typeof concept === "string" && !hasConcept(dataconfig.source, concept)) {
                  const dataSource = Vizabi.stores.dataSources.getAll().find(ds => hasConcept(ds, concept));
                  if (dataSource?.id) dataconfig.config.source = dataSource.id;
                }
              }
            }
          }
        });
        disposers.push(switchDataSourceIfConceptNotFound);

        googleAnalyticsLoadEvents(viz);

        window.viz = viz;

        window.VIZABI_DEFAULT_MODEL = diffObject(
          toJS(viz.model.config, { recurseEverything: true }),
          (URLI.model && URLI.model.model) ? deepExtend({}, URLI.model.model) : {}
        );

        const removeProperties = (obj, array, keyStack = "") => {
          Object.keys(obj).forEach(key => {
            if (array.some(s => (keyStack + "." + key).endsWith(s)))
              delete obj[key];
            else
              (obj[key] && typeof obj[key] === "object") && removeProperties(obj[key], array, keyStack + "." + key);
          });
          return obj;
        };

        urlUpdateDisposer = autorun(() => {
          const Utils = VizabiSharedComponents.Utils;
          const UI_CONFIG = VIZABI_UI_CONFIG;
          const DEFAULT_MODEL = VIZABI_DEFAULT_MODEL;
          const MODEL = VIZABI_MODEL;
          const LOCALE = VIZABI_LOCALE;
          const LAYOUT = VIZABI_LAYOUT;
          const PAGE_MODEL = VIZABI_PAGE_MODEL;

          let jsmodel = toJS(viz.model.config, { recurseEverything: true });
          let jsui = toJS(UI_CONFIG, { recurseEverything: true });

          jsmodel = diffObject(jsmodel, DEFAULT_MODEL || {});
          jsui = diffObject(jsui, MODEL.ui);

          const model = {
            model: Utils.clearEmpties(removeProperties(jsmodel, ["highlighted", "superhighlighted", "locale", "range", "frame.scale.domain", "presets"])),
            ui: Utils.clearEmpties(removeProperties(jsui, ["dragging", "opened"]))
          };

          if (PAGE_MODEL.ui.locale.id !== LOCALE.id)
            model.ui.locale = LOCALE.id;
          else
            delete model.ui.locale;
          if (PAGE_MODEL.ui.layout.projector !== LAYOUT.projector)
            model.ui.projector = LAYOUT.projector;
          else
            delete model.ui.projector;

          DEFAULT_MODEL && updateURL(model, undefined, true);
        }, { name: "tool.js: update url" });
      })
      .catch(err => console.error(`Failed to set up tool id = ${tool} with config from ${pathToConfig}
        Message: ${err.message}
        Stack: ${err.stack}`
      ));

  });
}

export {
  viz,
  setTool
};


//   'change_hook_which': function(evt, arg) {
//     if (gtag) gtag('event', 'indicator selected', {
//       'event_label': arg.which,
//       'event_category': arg.hook
//     });
//   },
//   'load_error': function(evt, error) {
//     if (gtag) gtag('event', 'error', {
//       'event_label': JSON.stringify(error).substring(0, 500), //500 characters is the limit of GA field
//       'event_category': this._name
//     });
//     if (gtag) gtag('event', 'exception', {
//       'description': JSON.stringify(error).substr(0,150), //150 characters is the limit of GA field
//       'fatal': true
//     });

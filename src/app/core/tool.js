
import {
  getFileReaderForVizabi,
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
function cleanupPreviousTool() {
  //kill the autorun reactions from the old tool
  if (urlUpdateDisposer) urlUpdateDisposer();
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
            "name": time < 30000 ? `${id} load` : `${id} load above 30s`,
            "value": time,
            "event_category": "Page load",
            "event_label": state.getTool()
          });
        };

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

const Tool = function({cmsData, state, dom}) {
  const {toolset, datasources, toolconfig} = cmsData;
  return {
    setTool: async function(tool, skipTransition = true) {
      
    


  if (tool === state.getTool()) return;
  if (!tool) tool = state.getTool();
  
  //gtag is a global variable from index.html
  //configure google analytics with the active tool, which would be counted as a "page view" of our single-page-application
  if (gtag) gtag("config", poduction ? GAPMINDER_TOOLS_GA_ID_PROD : GAPMINDER_TOOLS_GA_ID_DEV, { "page_title": tool, "page_path": "/" + tool });

  const toolsetEntry = toolset.find(f => f.id === tool);
  const toolsetEntryPrevious = toolset.find(f => f.id === state.getTool());
  state.setTool(tool);

  cleanupPreviousTool();

  timeLogger.removeAll();
  timeLogger.add("SPLASH");
  timeLogger.add("FULL");

  //LAZY-LOAD TOOLS JS CODE
  const toolsToLoad = [toolsetEntry.tool].concat(toolsetEntry.toolComponents || []);
  await Promise.all(toolsToLoad.map(
    tool => window[tool] 
      ? Promise.resolve() 
      : loadJS(tool.toLowerCase() + (ENV === "production" ? ".min.js" : ".js"), document.body)
  ));

  const pathToConfig = "config/toolconfigs/" + (toolsetEntry.config || toolsetEntry.tool) + ".js";
  await loadJS(pathToConfig, document.body, "vzb-tool-config")
    
      d3.select(".vizabi-placeholder")
        .append("div")
        .attr("class", "vzb-placeholder")
        .attr("style", "width: 100%; height: 100%;");

        // apply data models from configuration to pageConfig
        function applyDataConfigs(pageConfig) {
          if (!pageConfig.model.dataSources) pageConfig.model.dataSources = {};
          const urlDataConfig = state.getURLI().model?.dataSources;

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
              pageConfig.model.dataSources[ds].locale = state.getLocale() || pageConfig.ui.locale;
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
          const toolModelPrevious = {}; //TODO: viz ? viz.getPersistentMinimalModel(VIZABI_PAGE_MODEL_PREVIOUS) : {};
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
              path: "assets/translation/",
              getExternalFileReader: getFileReaderForVizabi
            })
          }
        }, VIZABI_MODEL, toolconfig.get(tool) || {});
        let pageConfig = window.VIZABI_PAGE_MODEL;
        pageConfig = applyDataConfigs(pageConfig);
        pageConfig = applyTransitionConfigs(pageConfig);
        if (state.getURLI().model) {
          VizabiSharedComponents.Utils.mergeInTarget(pageConfig.model, deepExtend(state.getURLI().model), /*treat as blocks:*/ ["data.filter"]);
        }
        window.VIZABI_UI_CONFIG = observable((state.getURLI().ui) ? deepExtend({}, state.getURLI().ui) : {});

        window.VIZABI_LOCALE = observable(VIZABI_PAGE_MODEL.ui.locale);
        if (VIZABI_UI_CONFIG.locale !== undefined) VIZABI_LOCALE.id = VIZABI_UI_CONFIG.locale;
        window.VIZABI_LAYOUT = observable(VIZABI_PAGE_MODEL.ui.layout);
        if (VIZABI_UI_CONFIG.projector !== undefined) VIZABI_LAYOUT.projector = VIZABI_UI_CONFIG.projector;

        state.setLocale(VIZABI_LOCALE.id); //should be a reaction instead of action
        state.setProjector("projector", VIZABI_LAYOUT.projector);

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

        /*
CUSTOM EVENT ANALYTICS CODE
see https://github.com/Gapminder/tools-page-analytics-server

        const searchInput =  viz.element.select("input.vzb-treemenu-search");
        viz.element.select(".vzb-treemenu-wrap").on("click.tm", function(e) {
          const sourceData = d3.select(e.srcElement).datum();
          if (sourceData.concept_type !== "measure" && sourceData.concept_type !== "string") return;

          // if (gtag) gtag("event", "concept_request", {
          //   "name": searchInput.node().value ? "search" : "menu",
          //   "value": sourceData.id,
          //   "event_category": sourceData?.byDataSources?.[0]?.dataSource?.id,
          //   "event_label": state.getTool()
          // });

          const options = `\
concept=${sourceData.id}\
&space=${sourceData?.byDataSources?.[0]?.spaces?.[0]}\
&tool=${state.getTool()}\
&dataset=${sourceData?.byDataSources?.[0]?.dataSource?.id}\
&type=${searchInput.node().value ? "search" : "menu"}\
&referer=${window.location.host}\
`;

          fetch(`https://tools-page-analytics-server.gapminder.org/record?${options}`);
        }, { capture: true });
*/

        // const mainMarkerName = Object.keys(VIZABI_MODEL.model.markers).filter(m => MAIN_MARKERS.includes(m))?.[0];
        // if (mainMarkerName) {
        //   const ignoredConcepts = [
        //     'time',
        //     'name',
        //     'geo',
        //     'country',
        //     'world_4region',
        //     'world_6region',
        //     'is--',
        //     'un_sdg_region',
        //     'g77_and_oecd_countries',
        //     'global',
        //     'income_3groups',
        //     'income_groups',
        //     'landlocked',
        //     'main_religion_2008',
        //     'un_sdg_ldc',
        //     'unhcr_region',
        //     'unicef_region',
        //     'west_and_rest',
        //     'age',
        //     'gender',
        //     'latitude',
        //     'longitude'
        //   ];
        //   const defaultSource = VIZABI_MODEL.model.markers[mainMarkerName].data.source;
        //   const encodings = VIZABI_MODEL.model.markers[mainMarkerName].encoding;
        //   const passedConcepts = [];
        //   Object.keys(encodings).filter(enc => enc !== "frame").forEach(encKey => {
        //     const encData = encodings[encKey]?.data;
        //     const concept = encData?.concept;
        //     if (!concept || passedConcepts.includes(concept) || encData.constant || ignoredConcepts.includes(concept)) return;
        //     passedConcepts.push(concept);

        //     if (gtag) gtag("event", "concept_request", {
        //       "name": "url",
        //       "value": concept,
        //       "event_category": encData.source || defaultSource,
        //       "event_label": state.getTool()
        //     });
        //   });
        // }

        window.VIZABI_DEFAULT_MODEL = diffObject(
          toJS(viz.model.config, { recurseEverything: true }),
          (state.getURLI().model) ? deepExtend({}, state.getURLI().model) : {}
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

          DEFAULT_MODEL && state.updateURL({model: model.model, ui: model.ui, tool:undefined, replaceInsteadPush: true});
        }, { name: "tool.js: update url" });
      
      // .catch(err => console.error(`Failed to set up tool id = ${tool} with config from ${pathToConfig}
      //   Message: ${err.message}
      //   Stack: ${err.stack}`
      // ));

      return viz;
      },
      setVizabiToolState({model = {}, ui = {}} = {}){
        //viz.setModel(poppedModel);
        runInAction(() => {
          VizabiSharedComponents.Utils.replaceProps(VIZABI_UI_CONFIG, ui);
          VizabiSharedComponents.Utils.mergeInTarget(viz.model.config, model);
        });
      },
      setVizabiLocale(id){
        if (viz?.services?.locale) viz.services.locale.id = id;
      },
      setVizabiProjector(truefalse){
        if (viz?.services?.layout) viz.services.layout.projector = truefalse;
      },
    
  }
}


export default Tool;


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

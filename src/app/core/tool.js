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
import { loadJS, comparePlainObjects, deepExtend, diffObject } from "./utils";
import timeLogger from "./timelogger";
import { observable, autorun, toJS, when } from "mobx";

let viz;
let stateListener;
let urlUpdateDisposer;

//cleanup the existing tool
function removeTool() {
  if (viz) {
    viz.deconstruct();
    viz = void 0;
  }
  d3.selectAll(".vzb-tool-config")
    .remove();
  d3.select(".vzb-placeholder")
    .remove();
}


function googleAnalyticsLoadEvents(marker) {
  if (marker.encoding.frame) {
    const splashMarker = marker.encoding.frame.splash.currentValueMarker;
    when(
      () => splashMarker.state == 'fulfilled',
      () => {
        const splashTime = timeLogger.snapOnce("SPLASH");
        if (gtag && splashTime) gtag("event", "timing_complete", {
          "name": "Splash load",
          "value": splashTime,
          "event_category": "Page load",
          "event_label": appState.tool
        });
      }
    );
  } 
  when(
    () => marker.state == 'fulfilled',
    () => {
      const fullTime = timeLogger.snapOnce("FULL");
      if (gtag && fullTime) gtag('event', 'timing_complete', {
        "name": "Full load",
        "value": fullTime,
        "event_category": 'Page load',
        "event_label": appState.tool
      });
    }
  );
}

function setTool(tool, skipTransition) {
  if (tool === appState.tool) return;
  if (!tool) tool = appState.tool;

  //configure google analytics with the active tool, which would be counted as a "page view" of our single-page-application
  if (gtag) gtag("config", poduction ? GAPMINDER_TOOLS_GA_ID_PROD : GAPMINDER_TOOLS_GA_ID_DEV, { "page_title": tool, "page_path": "/" + tool });

  const toolsetEntry = toolsPage_toolset.find(f => f.id === tool);
  const toolsetEntryPrevious = toolsPage_toolset.find(f => f.id === appState.tool);
  const toolModelPrevious = {} //TODO: viz ? viz.getPersistentMinimalModel(VIZABI_PAGE_MODEL_PREVIOUS) : {};
  appState.tool = tool;

  //kill old autorun listener
  if (urlUpdateDisposer) urlUpdateDisposer();
  removeTool();

  timeLogger.removeAll();
  timeLogger.add("SPLASH");
  timeLogger.add("FULL");

  const pathToConfig = "config/toolconfigs/" + (toolsetEntry.config || toolsetEntry.tool) + ".js";
  loadJS(pathToConfig, document.body)
    .then(() => {
      d3.select(".vizabi-placeholder")
        .append("div")
        .attr("class", "vzb-placeholder")
        .attr("style", "width: 100%; height: 100%;");

      // apply data models from configuration to pageConfig
      function applyDataConfigs(pageConfig) {
        if (!pageConfig.model.data) pageConfig.model.dataSources = {};
        const urlDataConfig = (URLI.model || {}).data;

        if (urlDataConfig) {
          //TODO handle the case when preferred data config of a marker/encoding is no longer among the data condigs of the URL
          pageConfig.model.dataSources = urlDataConfig;
        } else {
          //bring data configs from a separate config file to the page config (those mentioned in toolset)

          const dataSourcesId = toolsetEntry.dataSources || Object.keys(toolsPage_datasources);
          dataSourcesId.forEach(ds => {
            if (!toolsPage_datasources[ds]) 
              console.warn(`Could not find data config with key ${ds} in datasources file`);
            else
              pageConfig.model.dataSources[ds] = toolsPage_datasources[ds];
              pageConfig.model.dataSources[ds].locale = URLI.model?.ui?.locale || pageConfig.ui.locale;
          });
        }
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
        VizabiSharedComponents.Utils.mergeInTarget(pageConfig.model, deepExtend(URLI.model.model));
      }
      window.VIZABI_UI_CONFIG = observable((URLI.model && URLI.model.ui) ? deepExtend({}, URLI.model.ui) : {});

      window.VIZABI_LOCALE = observable(VIZABI_PAGE_MODEL.ui.locale);
      if (VIZABI_UI_CONFIG.locale !== undefined) VIZABI_LOCALE.id = VIZABI_UI_CONFIG.locale;
      window.VIZABI_LAYOUT = observable(VIZABI_PAGE_MODEL.ui.layout);
      if (VIZABI_UI_CONFIG.projector !== undefined) VIZABI_LAYOUT.projector = VIZABI_UI_CONFIG.projector;

      setLanguage(VIZABI_LOCALE.id);
      dispatch.call("languageChanged", null, VIZABI_LOCALE.id);  
      appState.projector = VIZABI_LAYOUT.projector;

      const toolPrototype = window[toolsetEntry.tool];
      const model = Vizabi(pageConfig.model);
      const markerId = ['bubble','line','bar','mountain'].find(id => model.markers[id])

      viz = new toolPrototype({
        placeholder: PLACEHOLDER,
        model: model,
        locale: VIZABI_LOCALE,
        layout: VIZABI_LAYOUT,
        ui: VIZABI_UI_CONFIG,
        default_ui: VIZABI_PAGE_MODEL.ui,
        options: {
          showLoading: true
        }
      });
      
      googleAnalyticsLoadEvents(model.markers[markerId])

      window.viz = viz;

      window.VIZABI_DEFAULT_MODEL = null;
      when(() => viz && Object.keys(viz.model.markers)
        .every(markerId => {
          const marker = viz.model.markers[markerId];
          return marker && marker.state == "fulfilled";
        }),
        () => window.VIZABI_DEFAULT_MODEL = diffObject(toJS(viz.model.config, {recurseEverything: true }), (URLI.model && URLI.model.model) ? deepExtend({}, URLI.model.model) : {})
      );

      const removeProperties = (obj, array) => {
        Object.keys(obj).forEach(key => {
          if (array.includes(key))
            delete obj[key];
          else
            (obj[key] && typeof obj[key] === "object") && removeProperties(obj[key], array);
        });
        return obj;
      };

      urlUpdateDisposer = autorun(() => {
        let jsmodel = toJS(viz.model.config, { recurseEverything: true });
        jsmodel = removeProperties(jsmodel, ["highlighted", "superhighlighted", "locale"]);

        let jsui = toJS(VIZABI_UI_CONFIG, { recurseEverything: true} );
        jsui = removeProperties(jsui, ["dragging"]);

        const model = {
          model: VizabiSharedComponents.Utils.clearEmpties(diffObject(jsmodel, VIZABI_DEFAULT_MODEL || {})),
          ui: VizabiSharedComponents.Utils.clearEmpties(diffObject(jsui, VIZABI_MODEL.ui))
        };
        if (VIZABI_PAGE_MODEL.ui.locale.id !== VIZABI_LOCALE.id) model.ui.locale = VIZABI_LOCALE.id
          else delete model.ui.locale;
        if (VIZABI_PAGE_MODEL.ui.layout.projector !== VIZABI_LAYOUT.projector) model.ui.projector = VIZABI_LAYOUT.projector
          else delete model.ui.projector;

        VIZABI_DEFAULT_MODEL && updateURL(model, undefined, true);
      }, { name: "tool.js: update url" });
    })
    .catch((err) => console.error(`Failed to set up tool id = ${tool} with config from ${pathToConfig}
      Message: ${err.message}
      Stack: ${err.stack}`
    ));
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

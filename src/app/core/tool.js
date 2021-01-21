import {
  appState
} from "./global";
import {
  URLI,
  updateURL
} from "./url";
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

function splash(marker) {
  let splashDoneOnce = false;
  const splashFrameValue = marker.config.encoding.frame.value;
  const splashConcept = marker.config.encoding.frame.data.concept;
  const splashFilter = {};
  splashFilter[splashConcept] = {};
  splashFilter[splashConcept][splashConcept] = splashFrameValue;
  let splashConfig = Vizabi.utils.deepclone(marker.config);
  const filterMerge = { data: { filter: { dimensions: splashFilter } } };
  splashConfig = Vizabi.utils.deepmerge(splashConfig, filterMerge);

  const splashMarker = Vizabi.marker(splashConfig);

  return new Proxy(marker, {
    get: (target, prop) => {

      if (marker.state == "fulfilled") {
        //splashDoneOnce prevents running splash load on subsequent changes in marker
        splashDoneOnce = true;
        return target[prop];
      } else if (!splashDoneOnce && splashMarker.state == "fulfilled") {
        return splashMarker[prop];
      }
      return target[prop];
    }
  });
}

function setTool(tool, skipTransition) {
  if (tool === appState.tool) return;
  if (!tool) tool = appState.tool;

  urlUpdateDisposer && urlUpdateDisposer();
  
  const toolsetEntry = toolsPage_toolset.find(f => f.id === tool);
  const toolsetEntryPrevious = toolsPage_toolset.find(f => f.id === appState.tool);
  const toolModelPrevious = {} //TODO: viz ? viz.getPersistentMinimalModel(VIZABI_PAGE_MODEL_PREVIOUS) : {};
  appState.tool = tool;

  removeTool();

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
          });
        }
        return pageConfig;
      }

      function applyTransitionConfigs(pageConfig) {
        if (skipTransition || !viz) return pageConfig;
        const transitionModel = getTransitionModel(toolModelPrevious, toolsetEntryPrevious.transition, toolsetEntry.transition);
        return deepExtend({}, pageConfig, transitionModel, true); //true --> overwrite by empty
      }

      window.VIZABI_PAGE_MODEL = deepExtend({}, VIZABI_MODEL);
      let pageConfig = VIZABI_MODEL;
      pageConfig = applyDataConfigs(pageConfig);
      pageConfig = applyTransitionConfigs(pageConfig);
      if (URLI.model && URLI.model.model) {
        VizabiSharedComponents.Utils.mergeInTarget(pageConfig.model, deepExtend(URLI.model.model));
      }
      window.VIZABI_UI_CONFIG = observable((URLI.model && URLI.model.ui) ? deepExtend({}, URLI.model.ui) : {});

      const toolPrototype = window[toolsetEntry.tool];
      viz = new toolPrototype({
        placeholder: ".vzb-placeholder",
        splash,
        model: Vizabi(pageConfig.model),
        locale: {
          "id": appState.language,
          "path": "assets/translation/"
        },
        layout: {
          "projector": appState.projector
        },
        ui: VIZABI_UI_CONFIG,
        default_ui: VIZABI_PAGE_MODEL.ui,
        options: {
          showLoading: true
        }
      });

      window.viz = viz;

      window.VIZABI_DEFAULT_MODEL = null;
      when(() => Object.keys(viz.model.config.markers)
        .every(markerId => {
          const marker = viz.model.stores.markers.get(markerId);
          return marker && marker.state == "fulfilled";
        }),
        () => window.VIZABI_DEFAULT_MODEL = diffObject(toJS(viz.model.config, {recurseEverything:true}), (URLI.model && URLI.model.model) ? deepExtend({}, URLI.model.model) : {}));

//      timeLogger.removeAll();
//      timeLogger.add("TOTAL");
//      timeLogger.add((viz.model.ui || {}).splash ? "SPLASH" : "FULL");
//      if (gaEnabled && gtag) gtag("config", GAPMINDER_TOOLS_GA_ID_PROD, { "page_path": "/" + toolsetEntry.tool });
//      if (gtag) gtag("config", GAPMINDER_TOOLS_GA_ID_DEV, { "page_path": "/" + toolsetEntry.tool });

      const removeProperties = (obj, array) => {
        Object.keys(obj).forEach(key => {
          if (array.includes(key))
            delete obj[key];
          else
            (obj[key] && typeof obj[key] === 'object') && removeProperties(obj[key], array);
        });
        return obj;
      };

      urlUpdateDisposer = autorun(() => {
        let jsmodel = toJS(viz.model.config, { recurseEverything: true });
        jsmodel = removeProperties(jsmodel, ["highlighted", "frame"]);

        let jsui = toJS(VIZABI_UI_CONFIG, { recurseEverything: true} );
        jsui = removeProperties(jsui, ["dragging"]);

        const model = {
          model: VizabiSharedComponents.Utils.clearEmpties(diffObject(jsmodel, VIZABI_DEFAULT_MODEL || {})),
          ui: VizabiSharedComponents.Utils.clearEmpties(diffObject(jsui, VIZABI_MODEL.ui))
        };

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











      //let snapOnceDataLoaded = false;

      // pageConfig.bind = {
      //   'ready': function(evt) {
      //       var splashTime = timeLogger.snapOnce("SPLASH");
      //       if (gtag && splashTime) gtag('event', 'timing_complete', {
      //         'name' : 'splashload',
      //         'value' : splashTime,
      //         'event_category' : 'Splash data loading time'
      //       });

      //       var fullTime = timeLogger.snapOnce("FULL");
      //       if (gtag && fullTime) gtag('event', 'timing_complete', {
      //         'name' : 'allyearsload',
      //         'value' : fullTime,
      //         'event_category' : 'Complete data loading time'
      //       });

      //       if ((this.ui||{}).splash) timeLogger.add("FULL");
      //       timeLogger.add("DATA");
      //       timeLogger.update("DATA");

      //       if (snapOnceDataLoaded) {
      //         updateURL(evt);
      //       }

      //       if (!snapOnceDataLoaded && (!(this.ui||{}).splash || fullTime)) {
      //         snapOnceDataLoaded = true;
      //         updateURL(evt, true);
      //     }
      //   },
      //   'persistentChange': function(evt) {
      //       updateURL(evt); // force update
      //   },
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

      //     var totalTime = timeLogger.snapOnce("TOTAL");
      //     if (gtag && totalTime) gtag('event', 'timing_complete', {
      //       'name' : 'loadtotal',
      //       'value' : totalTime,
      //       'event_category' : 'Time to error since vizabi object created'
      //     });
      //   },
      //   'dataLoaded': function() {
      //     var dataTime = timeLogger.snapOnce("DATA");
      //     if (gtag && dataTime) gtag('event', 'timing_complete', {
      //       'name' : 'gapfill',
      //       'value' : dataTime,
      //       'event_category' : 'Gap filling time'
      //     });

      //     var totalTime = timeLogger.snapOnce("TOTAL");
      //     if (gtag && totalTime) gtag('event', 'timing_complete', {
      //       'name' : 'loadtotal',
      //       'value' : totalTime,
      //       'event_category' : 'Total loading time since vizabi object created'
      //     });
      //   }
      // }
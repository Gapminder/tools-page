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
import { loadJS } from "./utils";
import timeLogger from "./timelogger";

let viz;

function setTool(tool, skipTransition) {
  if (tool === appState.tool) return;
  if (!tool) tool = appState.tool;
  const toolConfig = toolsPage_toolset.filter(function(f) { return f.id === tool; })[0];
  const toolConfigPrevious = toolsPage_toolset.filter(function(f) { return f.id === appState.tool; })[0];
  const toolModelPrevious = viz ? viz.getPersistentMinimalModel(VIZABI_PAGE_MODEL) : {};
  
  Vizabi.clearInstances();
  d3.select(".vzb-placeholder").remove();
  d3.select("body").select(".column.main").select(".vizabi-placeholder")
    .append("div")
    .attr("class", "vzb-placeholder")
    .attr("style", "width: 100%; height: 100%;");

  appState.tool = tool;
  loadJS("config/toolconfigs/" + (toolConfig.config || toolConfig.tool) + ".js" , loadTool, document.body);

  function loadTool() {

    const dataSourcesId = toolConfig.dataSources || Object.keys(toolsPage_datasources); 
    const dataSources = dataSourcesId.map(ds => toolsPage_datasources[ds]);

    const urlDataModel = (URLI.model || {}).data;
    const skipModel = urlDataModel && !Vizabi.utils.comparePlainObjects(urlDataModel, dataSources[0]);

    const _VIZABI_MODEL =  skipModel ? {} : VIZABI_MODEL;

    if (!skipModel) {
      Object.assign(_VIZABI_MODEL, dataSources.length > 1 ?
        dataSources.reduce(function(result, ds, index) {
          result["data" + (index ? "_" + dataSourcesId[index] : "")] = ds;
          return result;
        }, {})
      : { data: dataSources[0] })
    }
  
    let snapOnceDataLoaded = false;
    
    _VIZABI_MODEL.bind = {
      'ready': function(evt) {
          var splashTime = timeLogger.snapOnce("SPLASH");            
          if (gtag && splashTime) gtag('event', 'timing_complete', {
            'name' : 'splashload',
            'value' : splashTime,
            'event_category' : 'Splash data loading time'
          });

          var fullTime = timeLogger.snapOnce("FULL");
          if (gtag && fullTime) gtag('event', 'timing_complete', {
            'name' : 'allyearsload',
            'value' : fullTime,
            'event_category' : 'Complete data loading time'
          });
        
          if ((this.ui||{}).splash) timeLogger.add("FULL");
          timeLogger.add("DATA");
          timeLogger.update("DATA");
        
          if (snapOnceDataLoaded) {
            updateURL(evt);
          }

          if (!snapOnceDataLoaded && (!(this.ui||{}).splash || fullTime)) {
            snapOnceDataLoaded = true;
            updateURL(evt, true);
        }
      },
      'persistentChange': function(evt) {
          updateURL(evt); // force update
      },
      'change_hook_which': function(evt, arg) {
        if (gtag) gtag('event', 'indicator selected', {
          'event_label': arg.which,
          'event_category': arg.hook
        });
      },
      'load_error': function(evt, error) {            
        if (gtag) gtag('event', 'error', {
          'event_label': JSON.stringify(error).substring(0, 500), //500 characters is the limit of GA field
          'event_category': this._name
        });
        if (gtag) gtag('event', 'exception', {
          'description': JSON.stringify(error).substr(0,150), //150 characters is the limit of GA field
          'fatal': true
        });
        
        var totalTime = timeLogger.snapOnce("TOTAL");
        if (gtag && totalTime) gtag('event', 'timing_complete', {
          'name' : 'loadtotal',
          'value' : totalTime,
          'event_category' : 'Time to error since vizabi object created'
        });
      },
      'dataLoaded': function() {        
        var dataTime = timeLogger.snapOnce("DATA");
        if (gtag && dataTime) gtag('event', 'timing_complete', {
          'name' : 'gapfill',
          'value' : dataTime,
          'event_category' : 'Gap filling time'
        });

        var totalTime = timeLogger.snapOnce("TOTAL");
        if (gtag && totalTime) gtag('event', 'timing_complete', {
          'name' : 'loadtotal',
          'value' : totalTime,
          'event_category' : 'Total loading time since vizabi object created'
        });
      }
    }

    _VIZABI_MODEL.locale = {
      "id": appState.language,
      "filePath": "assets/translation/"
    };

    VIZABI_PAGE_MODEL = Vizabi.utils.deepExtend({}, _VIZABI_MODEL);
    delete VIZABI_PAGE_MODEL.bind;
    delete VIZABI_PAGE_MODEL.locale.id;

    const transitionModel = (!skipTransition && viz) ? getTransitionModel(toolModelPrevious, toolConfigPrevious.transition, toolConfig.transition) : URLI.model;
    viz = Vizabi(toolConfig.tool, document.getElementsByClassName('vzb-placeholder')[0], Vizabi.utils.deepExtend({}, _VIZABI_MODEL, transitionModel, true));
    
    timeLogger.removeAll();
    timeLogger.add("TOTAL")
    timeLogger.add((viz.model.ui||{}).splash? "SPLASH" : "FULL");
    if (gaEnabled && gtag) gtag('config', GAPMINDER_TOOLS_GA_ID_PROD, {'page_path': '/' + toolConfig.tool});
    if (gtag) gtag('config', GAPMINDER_TOOLS_GA_ID_DEV, {'page_path': '/' + toolConfig.tool});
  
  }
}

export {
  viz,
  setTool
};

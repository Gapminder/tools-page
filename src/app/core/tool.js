import {
  appState
} from "./global";
import {
  URLI,
  updateURL
} from "./url";
import { loadJS } from "./utils";

let viz;
let VIZABI_PAGE_MODEL;

function setTool(arg) {
  if (!arg) arg = appState.tool;
  Vizabi.clearInstances();
  d3.select(".vzb-placeholder").remove();
  d3.select("body").select(".column.main").select(".vizabi-placeholder")
    .append("div")
    .attr("class", "vzb-placeholder")
    .attr("style", "width: 100%; height: 100%;");
  const toolConfig = toolsPage.toolset.filter(function(f) { return f.id === arg; })[0];
  loadJS("assets/js/toolconfigs/" + (toolConfig.config || toolConfig.tool) + ".js" , function() {
      VIZABI_MODEL.locale = {
          "id": appState.language,
          "filePath": "assets/translation/"
      };
      VIZABI_MODEL.bind = {
          'ready': function(evt) {
              updateURL();
          },
          'persistentChange': function(evt) {
              updateURL(evt); // force update
          }
      }
      //VIZABI_MODEL.data = VIZABI_MODEL.data || 
      const dataSources = toolsPage.datasources.filter(function(f) { return f.toolIds.includes(toolConfig.id); });
      Object.assign(VIZABI_MODEL, dataSources.length > 1 ?
        dataSources.reduce(function(result, ds, index) {
          result["data_" + (index ? index : "")] = ds.datasource;
          return result;
        }, {})
      : { data: dataSources[0].datasource })
      VIZABI_PAGE_MODEL = Vizabi.utils.deepExtend({}, VIZABI_MODEL);
      delete VIZABI_PAGE_MODEL.bind;
      delete VIZABI_PAGE_MODEL.locale.id;
      viz = Vizabi(toolConfig.tool, document.getElementsByClassName('vzb-placeholder')[0], Vizabi.utils.deepExtend({}, VIZABI_MODEL, URLI.model, true));
  }, document.body);
  appState.tool = arg;
}

export {
  viz,
  VIZABI_PAGE_MODEL,
  setTool
};

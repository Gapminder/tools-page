import { initTranslator } from "./../../core/language.js";
import UserLogin from "./../../auth/user-login.js";
import * as urlService from "./../../core/url.js";
import * as cmsService from "./../../core/cms.js";
import toolsPage_properties from "toolsPage_properties";
import { supabaseClient } from "./../../auth/supabase.service";
import { renderDatasetSection } from "./datasetsView.js";
import { renderServerSection, updateServerCard } from "./serversView.js"; 
import {getServerData, getStatus, getDatasets, getDatasetInfo, sync, syncprogress} from "./waffle-helpers.js"

let syncStatus = 0;
let selectedServerId = null;

async function main({ DOCID_CMS, DOCID_I18N, DEFAULT_LOCALE = "en" } = {}) {
  const cmsData = await cmsService.load({ DOCID_CMS, DOCID_I18N, DEFAULT_LOCALE });
  const allowedTools = cmsData.toolset.filter(f => !!f.tool).map(m => m.id);
  const state = urlService.init({ allowedTools, defaultLocale: DEFAULT_LOCALE });
  const translator = await initTranslator(state, cmsData.properties?.locales);

  new UserLogin({ translator, state, dom: ".app-user-login" });

  state.dispatch.on("authStateChange.app", async (event) => {
    console.log(event);
    const stageEl = d3.select(".admin-stage#servers");
    const token = state.getAuthToken();
    if (token) {
      stageEl.html("");
      
      const serverList = await getServerData();
      renderServerSection(stageEl, serverList);

      const { data, error } = await supabaseClient
        .from('acl')
        .select('scope,resource,level')
        .eq('scope', 'dataset'); 

      if (error) console.error(error);
      const datasetAccessListLimitedToCurrentUser = data;

      selectedServerId = serverList[0].id;
      for await (const server of serverList){
        const status = await getStatus(server.url);
        Object.assign(server, {...status})
        updateServerCard(stageEl, server, selectedServerId);
      }
      if(!serverList.length) return;
      const selectedServer = serverList[0];
      
      const datasets = await getDatasets(selectedServer.url);
      const datasetInfo = await getDatasetInfo(selectedServer.url, token);

      renderDatasetSection(stageEl, {datasets, datasetInfo, syncDataset, datasetAccessListLimitedToCurrentUser});
       
    }
  });


  const sidebarElement = d3.select('.admin-sidebar');
  sidebarElement.selectAll(".nav-item").on("click", function(e) {
    const navEl = d3.select(this);
    sidebarElement.selectAll(".nav-item").classed("active", false);
    navEl.classed("active", true);

    d3.selectAll(".admin-stage").style("display", "none");
    const route = navEl.attr("data-route");
    d3.select(".admin-stage#" + route).style("display", null);
  });
}

main(toolsPage_properties).catch(err => {
  console.error(err);
  d3.select(".temp").text(`Error: ${err.message || err}`);
});



async function syncDataset(slug){
  function setStatusYellow(text) {
    text = formatSyncEvent(text);
    syncStatus = d3.create("div").style("background-color", "yellow").html(text).node();
  }
  function setStatusGreen(text) {
    text = formatSyncEvent(text);
    syncStatus = d3.create("div").style("background-color", "lightgreen").html(text)
      .transition().duration(5000).style("background-color", "white")
      .node();
  }
  function setStatusNone() {
    syncStatus = d3.create("div").style("background-color", "white").html("").node();
    update++;
  }

  function formatSyncEvent(events) {
    return events.length > 0 ? events.at(-1).comment : "";
  }


  const syncResponse = await sync(slug);
  setStatusYellow(syncResponse.events);
  const interval = setInterval(async ()=>{
    const syncProgressResponse = await syncprogress();
    if(syncProgressResponse.ongoing) {
      setStatusYellow(syncProgressResponse.events);
    } else {
      setStatusGreen(syncProgressResponse.events);
      setTimeout(setStatusNone, 3000);
      clearInterval(interval);
    }
  }, 500);
  
}




// admin.js
const root = document.getElementById('admin')
const toggleBtn = document.getElementById('sidebarToggle')

const collapsedKey = 'admin.sidebar.collapsed'
if (localStorage.getItem(collapsedKey) === '1') root.classList.add('is-collapsed')

toggleBtn.addEventListener('click', () => {
  root.classList.toggle('is-collapsed')
  localStorage.setItem(collapsedKey, root.classList.contains('is-collapsed') ? '1' : '0')
})


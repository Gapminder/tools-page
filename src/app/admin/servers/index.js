import { initTranslator } from "./../../core/language.js";
import UserLogin from "./../../auth/user-login.js";
import * as urlService from "./../../core/url.js";
import * as cmsService from "./../../core/cms.js";
import toolsPage_properties from "toolsPage_properties";
import { supabaseClient } from "./../../auth/supabase.service";
import { skeletonDatasetSection, renderDatasetSection } from "./datasetsTableView.js";
import { skeletonServerSection, renderServerSection, updateServerCard } from "./serversView.js"; 
import {getServerData, getWaffle, getStatus, getDatasetInfo} from "./waffle-helpers.js"
import {augmentD3SelectionPrototypeForEasierSyntax} from "./d3selectionPlugins.js";
let syncStatus = 0;
let selectedServerId = null;
let token = null;



augmentD3SelectionPrototypeForEasierSyntax();

async function main({ DOCID_CMS, DOCID_I18N, DEFAULT_LOCALE = "en" } = {}) {
  const cmsData = await cmsService.load({ DOCID_CMS, DOCID_I18N, DEFAULT_LOCALE });
  const allowedTools = cmsData.toolset.filter(f => !!f.tool).map(m => m.id);
  const state = urlService.init({ allowedTools, defaultLocale: DEFAULT_LOCALE });
  const translator = await initTranslator(state, cmsData.properties?.locales);

  new UserLogin({ translator, state, dom: ".app-user-login" });

  init();

  state.dispatch.on("authStateChange.app", async (event) => {
    if(token === state.getAuthToken()) return console.log(event, "✅ no token change");
    console.log(event);
    token = state.getAuthToken();
    refresh();
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
  d3.select(".admin-stage#servers").text(`Error: ${err.message || err}`);
});


const info = (text) => messageEl.class("message").style("display", text ? "block" : "none").html(text);
const bad = (text) => messageEl.class("message is-error").style("display", text ? "block" : "none").html(text);
const good = (text) => messageEl.class("message is-ok").style("display", text ? "block" : "none").html(text);
const progress = (text) => messageEl.class("message is-working").style("display", text ? "block" : "none").html(text);
let messageEl = null;

function init(){
  const stageEl = d3.select(".admin-stage#servers");
  skeletonServerSection(stageEl, refresh);
  skeletonDatasetSection(stageEl);
  messageEl = stageEl.append('div').attr('class', 'message');
}

async function refresh(){
  if (token) {    
    const serverList = await getServerData();
    renderServerSection(serverList);

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
      updateServerCard(server, selectedServerId);
    }
    if(!serverList.length) return;
    const selectedServer = serverList[0];
    
    const serverDatasets = selectedServer.datasetControlList;
    const serverDatasetSlugToBranchToCommitMapping = selectedServer.availableDatasets;
    const datasetInfo = await getDatasetInfo(selectedServer.url, token);
    const supaDatasets = await getWaffle(selectedServerId);

    renderDatasetSection({
      serverDatasetSlugToBranchToCommitMapping, 
      serverDatasets, 
      supaDatasets, 
      datasetInfo, 
      datasetAccessListLimitedToCurrentUser, 
      selectedServerId, 
      selectedServerUrl: selectedServer.url,
      refresh,
      bad, info, progress, good
    });
  } else {
    d3.select(".admin-stage#servers").text(`Not logged in or something broken`);
  }
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



//TODO: assume ownership when adding a dataset
//TODO: make WS survive requests like sync/undefined/
//TODO add dataset with a typo, start WS, it doesn't load all datasets past the error "opan-numbers/ddf--kolada--dump",

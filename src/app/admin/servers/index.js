import { initTranslator } from "./../../core/language.js";
import UserLogin from "./../../auth/user-login.js";
import * as urlService from "./../../core/url.js";
import * as cmsService from "./../../core/cms.js";
import toolsPage_properties from "toolsPage_properties";
import { supabaseClient } from "./../../auth/supabase.service";
import {accessControlDialogCreate} from "./accesscontrol-dialog.js";

import {getStatus, getDatasets, getDatasetInfo, sync, syncprogress, timediff} from "./waffle-helpers.js"

let syncStatus = 0;





function getStatusBar(server, width){
  const height = 30;
  const textHeight = 27;
  const barHeight = 3;

  const svg = d3.create("svg")
    .attr("width", width+"px")
    .attr("height", height+"px")

  const {limit_MB, heapTotal_MB, heapUsed_MB, heapTotal_PCT, heapUsed_PCT} = server.memory;
  const scale = d3.scaleLinear([0, limit_MB], [0, width])
  
  svg.append("rect")
    .attr("x",0)
    .attr("y", textHeight)
    .attr("width",scale(limit_MB))
    .attr("height", barHeight)
    .style("fill", "#484848")

  svg.append("rect")
    .attr("x",0)
    .attr("y", textHeight)
    .attr("width",scale(heapTotal_MB))
    .attr("height", barHeight)
    .style("fill", "#ccc")

  svg.append("rect")
    .attr("x",scale(heapUsed_MB))
    .attr("y", textHeight)
    .attr("width", 2)
    .attr("height", barHeight)
    .style("fill", "#484848") 

  svg.append("text")
    .attr("x",0)
    .attr("y", 20)
    .style("text-anchor", "start")
    .style("fill", "#484848")
    .style("font-family", "sans-serif")
    .text(`Memory used: ${heapUsed_PCT}%, allocated: ${heapTotal_PCT}% of ${limit_MB} MB limit`)
  
  return svg.node();
}


// Tiny UI stub (replace with your Observable mock later)
function getStatusTable({datasets, syncDataset, datasetInfo, timediff, datasetAccessListLimitedToCurrentUser}) {

  const maxBranches = d3.max(datasets, d => d.branches.length);
  const datasetsByAccess = d3.rollup(datasetAccessListLimitedToCurrentUser, v=>v.length, d=>d.resource, d => d.level);

  const table = d3.create("table")
    .attr("class", "admin-table")
    .style("max-width", "none");

  table.append("tr")
    .each(function(){
      const rowEl = d3.select(this);
      rowEl.append("th").text("sync")
      rowEl.append("th").text("slug")
      rowEl.append("th").text("github link")
      rowEl.append("th").attr("colspan", maxBranches).html('branches <br/> datapackage version and when last updated')
      rowEl.append("th").text("access")
    })
  table.selectAll("tr.dataset")
    .data(datasets)
    .enter().append("tr")
    .attr("class", "dataset")
    .each(function(row){
      const rowEl = d3.select(this);
      const firstCol = rowEl.append("td")
        .style("padding-bottom","10px")

      firstCol.append("button") 
        .attr("class", "button")
        .style("margin-bottom", "10px") 
        .on("click", () => syncDataset(row.slug))
        .html(`<span style="font-size: 1.2em;">↻</span> Sync`)
      firstCol.append("br") 
      firstCol.append("button") 
        .attr("class", "button delete")
        //.on("click", () => syncDataset(row.slug))
        .html(`Delete`)
      rowEl.append("td")
        .style("padding-bottom","10px")
        .style("font-size", "1.25em")
        .text(row.slug)
      rowEl.append("td")
        .html(`<a href="${row.url}">${row.githubRepoId.split("/")[1]}</a> <br/> <span style="color:#bbb"> @${row.githubRepoId.split("/")[0]} </<span>`)
      rowEl.selectAll("td.branch")
        .data(row.branches)
        .attr("class", "branch")
        .enter().append("td")
        .style("padding-bottom","10px")
        .style("font-family","Monospace")
        .html(b => `${formatBranchCommit(b)} </br> ${formatDataPackage(row.slug, b)} </br> <span class="button"><span style="font-size: 1.2em;">↻</span> Sync</span> <span class="button delete">Delete</span>`)

      const dba = datasetsByAccess.get(row.slug);
      if(dba){
        
        const td = rowEl.append("td");
        td.append("div")
          .style("margin-bottom", "10px") 
          .text(`👀 ${dba.get("reader") || 0}, ✏️ ${dba.get("editor") || 0}, 👑 ${dba.get("owner") || 0}`)
          
          
        td.append("div").append("button")
          .attr("class", "button")
          .text("Edit access")
          .on("click", async () => {
            await accessControlDialogCreate({scope: "dataset", resource: row.slug});
          })
      } else
        rowEl.append("td").text("Not an owner")
    })

  function formatDataPackage(slug, branchCommitObject){
    const info = datasetInfo[slug + " " + getBranch(branchCommitObject)];
    const version = info.version ? "v"+ info.version : "";
    const created = info.created ? timediff(info.created) : "";
    return `<span title="${(info.created+"").split(".")[0].replace("T", " at ")}">📦 ${version} ${created} </span>`
  }
  
  function formatBranchCommit(branchCommitObject){
    return JSON.stringify(branchCommitObject).replaceAll('"','').replaceAll('{','').replaceAll('}','').replaceAll(':',': ');
  }
  
  function getBranch(branchCommitObject){
    return Object.keys(branchCommitObject)[0]
  }

  return table.node();
}

function getProgressText(){
  return d3.create("div").style("background-color", "white").html("").node()
}

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


async function renderStatus(element, params){
  d3.select(element).html("");
  const table = getStatusTable(params);
  const progressText = getProgressText(params)
  element.appendChild(table);
  element.appendChild(progressText);
}

let selectedServerId = null;

const sidebarElement = d3.select('.admin-sidebar');

async function main({ DOCID_CMS, DOCID_I18N, DEFAULT_LOCALE = "en" } = {}) {
  const cmsData = await cmsService.load({ DOCID_CMS, DOCID_I18N, DEFAULT_LOCALE });
  const allowedTools = cmsData.toolset.filter(f => !!f.tool).map(m => m.id);
  const state = urlService.init({ allowedTools, defaultLocale: DEFAULT_LOCALE });
  const translator = await initTranslator(state, cmsData.properties?.locales);

  new UserLogin({ translator, state, dom: ".app-user-login" });

  state.dispatch.on("authStateChange.app", async (event) => {
    console.log(event);
    const token = state.getAuthToken();
    if (token) {
      const serverList = await getServerData();
      createServerCards(document.getElementById('statusGrid'), serverList);

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
        updateServerCard(d3.select("#statusGrid"), server);
      }
      if(!serverList.length) return;
      const selectedServer = serverList[0];
      
      const datasets = await getDatasets(selectedServer.url);
      const datasetInfo = await getDatasetInfo(selectedServer.url, token);
       
      renderStatus(document.getElementsByClassName("temp")[0], {datasets, datasetInfo, syncDataset, timediff, datasetAccessListLimitedToCurrentUser});

    }
  });


  sidebarElement.selectAll(".nav-item").on("click", function(e) {
    const navEl = d3.select(this);
    sidebarElement.selectAll(".nav-item").classed("active", false);
    navEl.classed("active", true);

    d3.selectAll(".admin-stage").style("display", "none");
    const route = navEl.attr("data-route");
    d3.select(".admin-stage#" + route).style("display", "block");
  });
}

main(toolsPage_properties).catch(err => {
  console.error(err);
  d3.select(".temp").text(`Error: ${err.message || err}`);
});


async function getServerData(){ 
  const { data, error } = await supabaseClient
    .from('servers')
    .select('*')
    .neq('id', '__all__'); 

  if (error) console.error(error);
  return data;
}
function createServerCards(element, data){
  statusGrid.innerHTML = "";
  data.forEach(d => statusGrid.appendChild(card({
    title: d.id,
    sub: d.url,
    image: "/tools/assets/images/waffle.png",
    status: {loading: true}
  })))
}

function updateServerCard(container, {id, server}){
  const kind = server ? "ok" : "error";
    
  const view = container.select("#" + id);
  view.select(".badge").attr("class", "badge "+kind).text(kind);
  if(kind!=="ok") return;
  view.classed("is-selected", () => id === selectedServerId);
  view.selectAll(".serverstatus")
    .text(`Small Waffle v${server.smallWaffleVersion}, DDFCSV Reader v${server.DDFCSVReaderVersion}, uptime ${timediff(server.liveSince, false, false)}`)
    
  view.node().appendChild(getStatusBar(server, view.node().clientWidth - 20))

 }



// admin.js
const root = document.getElementById('admin')
const toggleBtn = document.getElementById('sidebarToggle')
const statusGrid = document.getElementById('statusGrid')

const collapsedKey = 'admin.sidebar.collapsed'
if (localStorage.getItem(collapsedKey) === '1') root.classList.add('is-collapsed')

toggleBtn.addEventListener('click', () => {
  root.classList.toggle('is-collapsed')
  localStorage.setItem(collapsedKey, root.classList.contains('is-collapsed') ? '1' : '0')
})

function card({ title, sub, image, status }) {
  const kind = status?.server ? "ok" : (status?.loading ? "waiting" : "error");
  const el = document.createElement('div')
  el.role = "button"; 
  el.tabindex="0";
  el.id=title;
  el.className = 'admin-card';
  el.innerHTML = `
    <img src="${image}"></img>
    <div><span class="badge ${kind}">${kind}</span> <span class="card-title">${title}</span></div>
    <div class="card-sub">${sub ?? ''}</div>
    <div class="serverstatus"></div>
  `
  return el;
}
function row([id, task, status, updated]) {
  const tr = document.createElement('tr')
  tr.innerHTML = `<td>${id}</td><td>${task}</td><td>${status}</td><td>${updated}</td>`
  return tr
}




// card selection controller
function makeCardSelectable(container = document) {
  const cards = d3.selectAll('.admin-card');

  const select = (el) => {
    d3.selectAll('.admin-card').classed("is-selected", false)
    if (el) {
      el.classList.add('is-selected');
      el.dispatchEvent(new CustomEvent('cardselect', {
        bubbles: true,
        detail: { id: el.dataset.id }
      }));
    }
  };

  const isCard = (el) => el?.classList?.contains('admin-card');

  container.addEventListener('click', (e) => {
    const target = e.target.closest('.admin-card');
    if (isCard(target)) select(target);
  });

  container.addEventListener('keydown', (e) => {
    const target = e.target.closest('.admin-card');
    if (!isCard(target)) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      select(target);
    }
    // optional: arrow key navigation
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = target.nextElementSibling?.classList.contains('admin-card') ? target.nextElementSibling : null;
      next?.focus();
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = target.previousElementSibling?.classList.contains('admin-card') ? target.previousElementSibling : null;
      prev?.focus();
    }
  });

  // expose API
  return { selectById: (id) => select(cards.find(c => c.dataset.id === id)) };
}

// usage
const { selectById } = makeCardSelectable(document.getElementById('statusGrid'));
// programmatic selection example:
// selectById('server-1');

// listen for selection
document.getElementById('statusGrid').addEventListener('cardselect', (e) => {
  // swap table below, load details, whatever:
  // e.detail.id
  // console.log('Selected card:', e.detail.id);
});

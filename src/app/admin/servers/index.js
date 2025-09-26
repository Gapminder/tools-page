import { initTranslator } from "./../../core/language.js";
import UserLogin from "./../../auth/user-login.js";
import * as urlService from "./../../core/url.js";
import * as cmsService from "./../../core/cms.js";
import toolsPage_properties from "toolsPage_properties";
import { supabaseClient } from "./../../auth/supabase.service";

import {url, getStatus, getDatasets, getDatasetInfo, sync, syncprogress, timediff} from "./waffle-helpers.js"

let syncStatus = 0;



function getHeader({status}){
  const width = 800;
  const header = d3.create("div")
    .attr("style", `font-family: Monospace; text-align: center; padding: 5px; width: ${width}px; pointer-events: none;`)
    .text(`Small Waffle v${status.server.smallWaffleVersion} ——— DDFCSV Reader v${status.server.DDFCSVReaderVersion} ——— uptime ${timediff(status.server.liveSince, false, false)}`)

  return header.node();
}

function getStatusBar({status}){
  const height = 50;
  const width = 800;



  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)

  const {limit_MB, heapTotal_MB, heapUsed_MB, heapTotal_PCT, heapUsed_PCT} = status.server.memory;
  const scale = d3.scaleLinear([0, limit_MB], [0, width])
  
  svg.append("rect")
    .attr("x",0)
    .attr("y",height/2)
    .attr("width",scale(limit_MB))
    .attr("height",height/2)
    .style("fill", "lightgrey")

  svg.append("rect")
    .attr("x",0)
    .attr("y",height/2)
    .attr("width",scale(heapTotal_MB))
    .attr("height",height/2)
    .style("fill", "#217fb7")

  svg.append("rect")
    .attr("x",scale(heapUsed_MB))
    .attr("y",0)
    .attr("width", 2)
    .attr("height",height)
    .style("fill", "white")

  svg.append("text")
    .attr("x",5)
    .attr("y", 20)
    .style("text-anchor", "start")
    .style("fill", "white")
    .style("font-family", "sans-serif")
    .text(`Heap memory at ${heapTotal_PCT}% of ${limit_MB} MB limit`)
  
  return svg.node();
}


// Tiny UI stub (replace with your Observable mock later)
function getStatusTable({datasets, syncDataset, datasetInfo, timediff}) {

  const table = d3.create("table")
    .style("max-width", "none");

  table.append("tr")
    .each(function(){
      const rowEl = d3.select(this);
      rowEl.append("th").text("sync")
      rowEl.append("th").text("slug")
      rowEl.append("th").text("github link")
      rowEl.append("th").attr("colspan", 3).html('branches <br/> datapackage version and when last updated')
    })
  table.selectAll("tr.dataset")
    .data(datasets)
    .enter().append("tr")
    .attr("class", "dataset")
    .on("mouseover", function(){d3.select(this).style("background", "#EFF8FF")})
    .on("mouseout", function(){d3.select(this).style("background", "none")})
    .each(function(row){
      const rowEl = d3.select(this);
      rowEl.append("td")
        .style("padding-bottom","10px")
        .append("button") 
        .on("click", () => syncDataset(row.slug))
        .html(`<span style="font-size: 1.2em;">↻</span> Sync`)
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
        .html(b => `${formatBranchCommit(b)} </br> ${formatDataPackage(row.slug, b)}`)
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
  const header = getHeader(params);
  const bar = getStatusBar(params);
  const table = getStatusTable(params);
  const progressText = getProgressText(params)
  element.appendChild(header);
  element.appendChild(bar);
  element.appendChild(table);
  element.appendChild(progressText);
}



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
      // TODO: point to real waffle endpoint (env or config)
      const status = await getStatus(token);
      const datasets = await getDatasets(token);
      const datasetInfo = await getDatasetInfo(token);
      renderStatus(document.getElementsByClassName("temp")[0], {status, datasets, syncDataset, datasetInfo, timediff});
      const serverData = await getServerData(token);
      renderServers(document.getElementById('statusGrid'), serverData)
    }
  });
}

main(toolsPage_properties).catch(err => {
  console.error(err);
  d3.select(".temp").text(`Error: ${err.message || err}`);
});


async function getServerData(token){ 
  const { data, error } = await supabaseClient
    .from('servers')
    .select('*')
    .neq('id', '__all__');   // or whatever sentinel you chose

  if (error) console.error(error);
  return data;
}
async function renderServers(element, data){
// example data (replace with live fetch to your Waffle/Supabase combo)
  statusGrid.innerHTML = "";
  data.forEach(d => statusGrid.appendChild(card({
    title: d.id,
    sub: d.url,
    badge: {kind: "ok", text: "200"}
  })))
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

// demo render helpers
function card({ title, sub, badge }) {
  const el = document.createElement('div')
  el.role = "button"; 
  el.tabindex="0";
  el["data-id"]="server-1";
  el.className = 'admin-card';
  el.innerHTML = `
    <div class="card-title">${title}</div>
    <div class="card-sub">${sub ?? ''}</div>
    <div class="badge ${badge?.kind ?? 'ok'}">${badge?.text ?? 'OK'}</div>
  `
  return el
}
function row([id, task, status, updated]) {
  const tr = document.createElement('tr')
  tr.innerHTML = `<td>${id}</td><td>${task}</td><td>${status}</td><td>${updated}</td>`
  return tr
}




// card selection controller
function makeCardSelectable(container = document) {
  const cards = [...container.querySelectorAll('.admin-card')];

  const select = (el) => {
    cards.forEach(c => c.classList.remove('is-selected'));
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

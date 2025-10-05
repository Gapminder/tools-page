import {timediff} from "./waffle-helpers.js";

let container = null;


export function skeletonServerSection(view, refresh){
  container = view
    .selectAll("section#servers")
    .data([0])
    .join("section").attr("id", "servers");

  const sectionHeader = container.append("div").attr("class", "admin-section-header")
    sectionHeader.append("h1").text("Servers");

  const actionsBox = sectionHeader.append("div").attr("class", "actionsbox")
    actionsBox.append("button").attr("class", "button").text("⬇⬆ Refresh").on("click", refresh)

  const statusGrid = container.append("div").attr("class", "admin-grid");
}


export function renderServerSection(data){
  const statusGrid = container.select("div.admin-grid");
  
  const cards = statusGrid.selectAll("div.admin-card").data(data, d => d.id);
  cards.enter().append((d) => card({ title: d.id, sub: d.url, image: "/tools/assets/images/waffle.png", status: {loading: true}}));
  cards.exit().remove();

  makeCardSelectable(statusGrid.node());

  // listen for selection
  statusGrid.node().addEventListener('cardselect', (e) => {
    console.log('Selected card:', e.detail.id);
  });
}

export function updateServerCard({id, server}, selectedServerId){
  const kind = server ? "ok" : "error";
    
  const view = container.select("#" + id);
  view.select(".badge").attr("class", "badge "+kind).text(kind);
  if(kind!=="ok") return;
  view.classed("is-selected", () => id === selectedServerId);
  view.selectAll(".serverstatus")
    .text(`Small Waffle v${server.smallWaffleVersion}, DDFCSV Reader v${server.DDFCSVReaderVersion}, uptime ${timediff(server.liveSince, false, false)}`)
    
  view.select("svg").remove();
  view.append(() => getStatusBar(server, view.node().clientWidth - 20))
}

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





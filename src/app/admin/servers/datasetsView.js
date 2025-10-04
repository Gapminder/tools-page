import {accessControlDialogCreate} from "./accesscontrol-dialog.js";
import {timediff} from "./waffle-helpers.js";

// Tiny UI stub (replace with your Observable mock later)
export function renderDatasetSection(view, {datasets, syncDataset, datasetInfo, datasetAccessListLimitedToCurrentUser}) {

    const container = view.append("section");
    const sectionHeader = container.append("div").attr("class", "admin-section-header")
    sectionHeader.append("h1").text("Datasets");

  
    const maxBranches = d3.max(datasets, d => d.branches.length);
    const datasetsByAccess = d3.rollup(datasetAccessListLimitedToCurrentUser, v=>v.length, d=>d.resource, d => d.level);
  
    const table = container.append("table")
      .attr("class", "admin-table")
      .style("max-width", "none");
  
    table.append("tr")
      .each(function(){
        const rowEl = d3.select(this);
        rowEl.append("th").text("sync")
        rowEl.append("th").text("slug")
        rowEl.append("th").text("github link")
        rowEl.append("th").attr("colspan", maxBranches).html('branches <br/> when last updated')
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
        const deleteButton = firstCol.append("button") 
          .attr("class", "button delete hold-btn")
          //.on("click", () => syncDataset(row.slug))
          .html(`Delete`)

        holdButton(deleteButton, (el, evt, d) => {
          rowEl.append("div").attr("class", "crossed");
          console.log('Delete!', d)
        });

        rowEl.append("td")
          .style("padding-bottom","10px")
          .style("font-size", "1.25em")
          .text((row.is_private ? "🔒 " : "") + row.slug)
        rowEl.append("td")
          .html(`<a href="${row.url}">${row.githubRepoId.split("/")[1]}</a> <br/> <span style="color:#bbb"> @${row.githubRepoId.split("/")[0]} </<span>`)
        rowEl.selectAll("td.branch")
          .data(row.branches)
          .attr("class", "branch")
          .enter().append("td")
          .style("padding-bottom","10px")
          .style("font-family","Monospace")
          .html(b => `${formatBranchCommit(b)} </br> ${formatDataPackage(row.slug, b)} </br> <button class="button micro"><span style="font-size: 1.2em;">↻</span></button> <button class="button delete micro"><span style="font-size: 1.2em;">✕</span></button>`)
  
        const dba = datasetsByAccess.get(row.slug);
        if(!row.is_private) {
          rowEl.append("td").text("Public dataset")
        } else if(dba){
          
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
      return `<span title="${(info.created+"").split(".")[0].replace("T", " at ")}">${created}</span>`
    }
    
    function formatBranchCommit(branchCommitObject){
      return "⼘" + JSON.stringify(branchCommitObject).replaceAll('"','').replaceAll('{','').replaceAll('}','').replaceAll(':',': ');
    }
    
    function getBranch(branchCommitObject){
      return Object.keys(branchCommitObject)[0]
    }
  
    const sectionFooter = container.append("div").attr("class", "admin-section-footer");
    sectionFooter.append("button").attr("class", "button addnew").text("✚ Add new dataset")

    const actionsBox = sectionFooter.append("div").attr("class", "actionsbox")
    actionsBox.append("button").attr("class", "button").text("↻ Sync all datasets")
    actionsBox.append("button").attr("class", "button").text("⋮")
    
    return view;
  }


// d3-hold-delete.js
// usage: holdButton(d3.selectAll('.hold-btn'), (el, evt, d) => { /* delete */ }, 2000)

function holdButton(selection, onHoldComplete, duration = 1000) {
  const state = new WeakMap();

  selection.each(function () {
    const el = this;
    const btn = d3.select(el);
    state.set(el, { timer: null, done: false });

    const start = (event) => {
      const s = state.get(el);
      if (!s || s.done) return;
      btn.classed('is-holding', true);
      // avoid text selection while holding
      event.preventDefault?.();

      s.timer = setTimeout(() => {
        s.done = true;
        btn.classed('is-holding', false).classed('is-done', true);
        onHoldComplete && onHoldComplete(el, event, btn.datum());
      }, duration);
    };

    const cancel = () => {
      const s = state.get(el);
      if (!s) return;
      clearTimeout(s.timer);
      if (!s.done) btn.classed('is-holding', false);
    };

    btn
      .on('pointerdown.hold', start)
      .on('pointerup.hold pointerleave.hold pointercancel.hold', cancel)
      .on('contextmenu.hold', (e) => e.preventDefault()); // stop long-press menu
  });

  // optional tiny API
  selection.resetHold = () =>
    selection.each(function () {
      const s = state.get(this);
      if (s) s.done = false;
      d3.select(this).classed('is-done', false).classed('is-holding', false);
    });

  return selection;
}

// Example:
// holdButton(d3.selectAll('.hold-btn'), (el, evt, d) => console.log('Delete!', d));

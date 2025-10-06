import {accessControlDialogCreate} from "./accesscontrol-dialog.js";
import {timediff} from "./waffle-helpers.js";
import {buildFormToAddBranch, buildFormToAddDataset} from "./datasetsTableForms.js";
import { holdButton } from "./ui-library.js";
import { supabaseClient } from "../../auth/supabase.service";
import { syncDataset }  from "./statusBarView.js";

let container = null;
let formEl = null;
let addNewButtonEl = null;
let syncAllButtonEl = null;

let branchesMissingFromSupa = {};
let branchesMissingFromServer = {};
const isBranchForAddition = (slug, branch) => branch && branchesMissingFromServer[slug] && branchesMissingFromServer[slug][branch]; 
const isBranchForDeletion = (slug, branch) => branch && branchesMissingFromSupa[slug] && branchesMissingFromSupa[slug][branch]; 

const getDsGithubUrl = (dataset) => `https://github.com/${dataset.githubRepoId}`;

function formatDataPackage(datasetInfo, slug, branch){
  const info = datasetInfo[slug + " " + branch];
  //const version = info.version ? "v"+ info.version : "";
  if (!info) return "";
  const created = info.created ? timediff(info.created) : "";
  return `<span title="${(info.created+"").split(".")[0].replace("T", " at ")}">${created}</span>`
}


const showAllAddButtons = () => container.selectAll("button.addnew").style("visibility", null);
const hideAllAddButtons = () => container.selectAll("button.addnew").style("visibility", "hidden");


function mergeDatasetsFromServerAndWaffle({serverDatasets, supaDatasets}){
  for (let serverDS of serverDatasets){
    const supaDS = supaDatasets.find(w => w.slug === serverDS.slug);
    if (!supaDS)
      serverDS.missingFromSupa = true;
    else
      serverDS.branches = joinBranches({serverDS, supaDS});
  }

  for (let supaDS of supaDatasets){
    const dataset = serverDatasets.find(d => d.slug === supaDS.slug);
    if (!dataset){
      supaDS.missingFromServer = true;        
      serverDatasets.push(supaDS);
    }
  }
  return serverDatasets;
}

function joinBranches({serverDS, supaDS}){
  const slug = serverDS.slug;

  for (let serverBranch of serverDS.branches){
    const supaBranch = supaDS.branches.includes(serverBranch);
    if (!supaBranch)
      (branchesMissingFromSupa[slug] ??= {})[serverBranch] = true;
  }

  for (let supaBranch of supaDS.branches){
    const serverBranch = serverDS.branches.includes(supaBranch);
    if (!serverBranch){
      (branchesMissingFromServer[slug] ??= {})[supaBranch] = true;
      serverDS.branches.push(supaBranch);
    }
  }
  return serverDS.branches;
}

export function skeletonDatasetSection(view){
  container = view.append("section");
  const sectionHeader = container.append("div").class("admin-section-header");
  sectionHeader.append("h1");

  const actionsBox = sectionHeader.append("div").class("actionsbox")
  addNewButtonEl = actionsBox.append("button").class("button addnew").text("✚ Add a new dataset")
  syncAllButtonEl = actionsBox.append("button").class("button").text("↻ Sync all datasets")
  //actionsBox.append("button").class("button").text("⋮")

  container.append("table");
  formEl = container.append('form').attr('class', 'form').style("visibility", "hidden");

  container.append("div").class("admin-section-footer");    
}


export function renderDatasetSection({
  serverDatasetSlugToBranchToCommitMapping, 
  serverDatasets, 
  supaDatasets,
  waffleDatasources,
  datasetInfo, 
  datasetAccessListLimitedToCurrentUser, 
  selectedServerId, 
  selectedServerUrl,
  refresh, bad, info, progress, good
}) {

    container.select(".admin-section-header").select("h1").text(`Datasets of ${selectedServerId}`);

    info();
    branchesMissingFromServer = {};
    branchesMissingFromSupa = {};
    serverDatasets = mergeDatasetsFromServerAndWaffle({serverDatasets, supaDatasets});

    const maxBranches = d3.max(serverDatasets, d => d.branches.length);
    const datasetsByAccess = d3.rollup(datasetAccessListLimitedToCurrentUser, v=>v.length, d=>d.resource, d => d.level);
    const usedByHowManyPageDatasources = d3.rollup(waffleDatasources, v => v.length, d => d.reader_properties.dataset);
    const isDatasetInAllServers = (dataset) => supaDatasets.find(f => f.slug === dataset.slug && f.server === "__all__");
    const getDefaultBranchOnSupa = (dataset) => supaDatasets.find(f => f.slug === dataset.slug)?.default_branch;
  
    const table = container.select("table")
      .class("admin-table")
      .style("max-width", "none");
    table.selectAll("tr").remove();
    table.append("tr")
      .call((rowEl) => {
        rowEl.append("th").text("sync")
        rowEl.append("th").text("slug")
        rowEl.append("th").text("github link")
        rowEl.append("th").html("add <br/> branch")
        rowEl.append("th").attr("colspan", maxBranches).html('branches <br/> when last updated')
        rowEl.append("th").text("access")
      })
    table.selectAll("tr.dataset")
      .data(d3.sort(serverDatasets, d => d.slug))
      .enter().append("tr")
      .class("dataset")
      .classed("for-addition", d => d.missingFromServer)
      .classed("for-deletion", d => d.missingFromSupa)
      .classed("nonremovable", isDatasetInAllServers)
      .each(function(dataset){
        const rowEl = d3.select(this);

        rowEl.append("td").append("div").class("actionsbox").call(group => {
          group.append("button") 
            .class("button")
            .on("click", () => syncDataset({selectedServerId, selectedServerUrl, slug: dataset.slug, good, info, progress, bad, refresh}))
            .html(`<span style="font-size: 1.2em;">↻</span> Sync`)

          const deleteButton = group.append("button") 
            .class("button delete hold-btn")
            .text(`Delete`)
  
          holdButton(deleteButton, () => deleteDataset({dataset, selectedServerId, refresh, bad, info, good}) );
        })
  
        rowEl.append("td")
          .style("font-size", "1.25em")
          .text((dataset.is_private ? "🔒 " : "") + dataset.slug)

        rowEl.append("td")
          .html(`<a href="${getDsGithubUrl(dataset)}" target="_blank">${dataset.githubRepoId.split("/")[1]}</a> <br/> <span style="color:#546375"> @${dataset.githubRepoId.split("/")[0]} </span> ${dataset.waffleFetcherAppInstallationId ? '<br/> <span style="color: #546375">via Waffle Fetcher ' + dataset.waffleFetcherAppInstallationId + '</span>': ""}`)
        
        rowEl.append("td")
          .append("button")
          .class("button addnew")
          .html(`✚`)
          .on("click", () => buildFormToAddBranch({
            formEl, 
            dataset, 
            getDefaultBranchOnSupa,
            action: (args) => {
              return supabaseClient
                .from('waffle')
                .update(args)
                .eq('id', dataset.slug)
                .eq('server', selectedServerId)
            }, 
            onActionSuccess: refresh, 
            onFormInit: hideAllAddButtons, 
            onFormDestroy: showAllAddButtons, 
            bad,info,good
          }));
          
        rowEl.selectAll("td.branch")
          .data(Array(maxBranches))
          .enter().append("td")
          .class("branch")
          .classed("for-addition", (_, i) => !dataset.missingFromServer && isBranchForAddition(dataset.slug, dataset.branches[i]))
          .classed("for-deletion", (_, i) => !dataset.missingFromSupa && isBranchForDeletion(dataset.slug, dataset.branches[i]))
          .style("font-family","Monospace")
          .each(function(_,i){
            const branch = dataset.branches[i];
            if(!branch) return;

            const view = d3.select(this);
            const slug = dataset.slug;

            const formatBranchCommit = (branch, slug) => {
              const commit = (serverDatasetSlugToBranchToCommitMapping[slug]||{})[branch]?.substr(0,7);
              return `${branch}: ${commit||"NEEDS SYNC"}`
            }

            const isTheOnlyBranch = dataset.branches.length <= 1;
            const isDefaultBranch = !isTheOnlyBranch && dataset.default_branch === branch;

            view.append("div").class("branchname").classed("default",isDefaultBranch)
              .attr("title", isDefaultBranch?"⼘ Default branch":"").html(formatBranchCommit(branch, slug));
            view.append("div").html(formatDataPackage(datasetInfo, slug, branch));
            view.append("div").html("·".repeat(usedByHowManyPageDatasources.get(`${slug}/${branch}`) || 0));

            view.append("div").class("actionsbox micro")
              .style("visibility", () => isTheOnlyBranch ? "hidden" : null)
              .call((group) => {
                group.append("button")
                  .class("button micro")
                  .text("↻ sync")
                  .on("click", () => syncDataset({selectedServerId, selectedServerUrl, slug, branch, good, info, progress, bad, refresh}))

                const deleteButton = group.append("button") 
                  .class("button delete micro hold-btn")
                  .text("✘")
    
                holdButton(deleteButton, () => {
                  deleteBranch({branch, dataset, getDefaultBranchOnSupa, selectedServerId, refresh, bad, info, good});
                });
              })

            view.append("div").class("overlay")
              .on("mouseenter", () => good("Sync all dataset to apply changes. Partial sync when adding/removing datasets or branches is not implemented yet"))
              .on("mouseout", () => info());
          })
  
        

        const dba = datasetsByAccess.get(dataset.slug);
        if(!dataset.is_private) {
          rowEl.append("td").text("Public dataset")
        } else if(dba){
          
          const td = rowEl.append("td");
          td.append("div")
            .style("margin-bottom", "10px") 
            .text(`👀 ${dba.get("reader") || 0}, ✏️ ${dba.get("editor") || 0}, 👑 ${dba.get("owner") || 0}`)
            
            
          td.append("div").append("button")
            .class("button")
            .text("Edit access")
            .on("click", async () => {
              await accessControlDialogCreate({scope: "dataset", resource: dataset.slug});
            })
        } else
          rowEl.append("td").text("Not an owner")

        rowEl.append("div").class("overlay")
          .on("mouseenter", () => good("Sync all dataset to apply changes. Partial sync when adding/removing datasets or branches is not implemented yet"))
          .on("mouseout", () => info());
      })
      
    addNewButtonEl.on("click", () => buildFormToAddDataset({
        formEl, 
        datasets: serverDatasets, 
        action: (args) => {
          return supabaseClient
            .from('waffle')
            .insert({
              ...args, 
              server: selectedServerId
            });
        }, 
        onActionSuccess: refresh, 
        onFormInit: hideAllAddButtons, 
        onFormDestroy: showAllAddButtons, 
        bad,info,good
      }));

      syncAllButtonEl.on("click", () => syncDataset({
        selectedServerId, 
        selectedServerUrl,
        good, info, progress, bad, refresh
      }))

    return container;
  }




async function deleteBranch({branch, dataset, getDefaultBranchOnSupa, selectedServerId, refresh, bad, info, good}){
  if (!branch) 
    return bad("BUG: branch not provided"); //❌
  if (!dataset.branches.filter(f => f!==branch)) 
    return bad("Can't delete the last remaining branch. Delete entire dataset instead."); //❌

  const defaultOnSupa = getDefaultBranchOnSupa(dataset);
  const possiblyResetDefault = defaultOnSupa === branch ? {default_branch: null} : {};
  const { error } = await supabaseClient
    .from('waffle')
    .update({ branches: dataset.branches.filter(f => f!==branch).join(","), ...possiblyResetDefault })
    .eq('id', dataset.slug)
    .eq('server', selectedServerId)

  if (error) return bad(error.message || "Didn't succeed deleting the branch"); //❌
  good('Branch scheduled for deletion'); //✅
  setTimeout(() => refresh(), 500);    
}


async function deleteDataset({dataset, selectedServerId, refresh, bad, info, good}){
  if (!dataset) 
    return bad("BUG: daset not provided"); //❌

  const { error } = await supabaseClient
    .from('waffle')
    .delete()
    .eq("id", dataset.slug)
    .eq("server", selectedServerId)

  if (error) bad(error.message || "Didn't succeed deleting the dataset"); //❌
  good('Dataset scheduled for deletion'); //✅
  setTimeout(() => refresh(), 500);
}

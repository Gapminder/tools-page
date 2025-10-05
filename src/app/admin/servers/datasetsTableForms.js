const WAFFLE_FETCHER_LINK = `<a href="https://github.com/apps/waffle-fetcher" target="_blank">Waffle Fetcher App</a>`

function sanitizeBranchList(input) {
  if (!input) return '';
  return input.split(',')
    .map(s => s.trim())
    .filter(Boolean) // drop empty
    .filter(b => branchPattern.test(b))
    .join(','); 
}
function parseGithubLinkOrRepo(input){
  if (!input) return null;
  const ghLink = input.match(ghLinkPattern);
  const ghRepo = input.match(ghRepoPattern);
  if (ghLink && ghLink[1])
    return ghLink[1];
  if (ghRepo && ghRepo[1] && ghRepo[2]) 
    return `${ghRepo[1]}/${ghRepo[2]}`;
  return null;
}
// Regex based on Git refname rules simplified for branches. Disallows: space, ~ ^ : ? * [ \, double dots, leading/trailing slash or dot
const branchPattern = /^(?!\/)(?!.*\/\/)(?!.*\.\.)(?!.*[~^:?*[\]\\])(?!.*\/$)(?!.*\.$)(?!^@$)[\w./-]+$/;
// Regex: lowercase letters a–z, digits, dash, underscore; not starting with digit or symbol
const slugPattern = /^[a-z][a-z0-9_-]*$/;
// Regex for optional @, owner/repo
const ghRepoPattern = /^@?([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+)$/;
// Regex: matches full GitHub HTTPS URLs, optional .git, captures owner/repo
const ghLinkPattern = /^https:\/\/github\.com\/([A-Za-z0-9._-]+\/[A-Za-z0-9._-]+)(?:\.git)?$/;
// Regex: matches only digits, no whitespace, no sign, no decimal:
const numericPattern = /^[0-9]+$/;


export function buildFormToAddBranch({formEl, dataset, action, onActionSuccess, onFormInit, onFormDestroy, bad, info, good}){

  onFormInit();
  formEl.style("visibility", "visible").selectAll("div").remove();
  info(); //reset message classes and content 

  formEl.append('div').class('form-row')
    .html(`Add a new branch for ${dataset.slug} dataset`);

  const rowEl = formEl.append('div').class('form-row');
  rowEl.append('div').class('form-col')
    .call((group) => {
      group.append('label').for("branch").class("label required").text("branch");
      group.append('input')
        .style("max-width", "250px")
        .type("text")
        .id("branch")
        .class("input")
        .placeholder("branchname")
        .required(true)
        .on("focus", () => info(`Branch to add from Github`))
        .on("blur", () => info());
    });
  rowEl.append('div').class('form-col')
    .append("button")
    .type("submit")
    .class("button addnew")
    .text("Add this branch");


  formEl.on('submit', async (e) => {
    e.preventDefault();  

    const branch = formEl.select('#branch').property('value').trim() || null;
    if(branch && !branchPattern.test(branch)) 
      return bad(`Branch doesn't pass the vibe check`); //❌
    
    if(dataset.branches?.includes(branch)) 
      return bad(`Branch already added`); //❌

    const { error } = await action({ branches: dataset.branches.concat(branch).join(",") });

    if (error) return bad(error.message || "Didn't succeed adding the branch"); //❌

    good('Branch adding scheduled!'); //✅
    setTimeout(() => {
      info(); 
      formEl.style("visibility", "hidden").selectAll("div").remove();
      onFormDestroy();
      if (!error) onActionSuccess();
    }, 500);
  });
}

  






export function buildFormToAddDataset({formEl, datasets, action, onActionSuccess, onFormInit, onFormDestroy, bad, info, good}){

  onFormInit();
  formEl.style("visibility", "visible").selectAll("div").remove();
  info(); //reset message classes and content 

  formEl.append('div').class('form-row')
    .html(`Add a new dataset. <span style="color:#546375">Must be a <a href="https://open-numbers.github.io/ddf" target="_blank">DDF CSV dataset</a>. Click around to get hints!</span>`)

  const formRow = formEl.append('div').class('form-row');
  const formRow2 = formEl.append('div').class('form-row collapsed');
  const formRow3 = formEl.append('div').class('form-row');

  formRow.append('div').class('form-col')
    .call((group) => {
      group.append('label').for('slug').class('label required').text('slug');
      group.append('input')
        .type("text")
        .id("slug")
        .class('input')
        .placeholder('epic-dataset')
        .required(true)
        .on("focus", () => info(`Short and readable examples: health-data, health_data2. Small a-z characters only, also digits, _ and - if not in the first position.`))
        .on("blur", () => info());
    })
    
  formRow.append('div').class('form-col form-grow')
    .call((group) => {
      group.append('label').for('github').class('label required').text('github');
      group.append('input')
        .type("text")
        .id("github")
        .class('input')
        .placeholder('https://github.com/owner/repo.git')
        .required(true)
        .on("focus", () => info(`Github link or id: omitting ".git" works too, you can also use "[@]owner/repo" notation.`))
        .on("blur", () => info());
    })

  formRow.append('div').class('form-col')
    .call((group) => {
      group.append('label').for('branches').class('label required').text('branches')
      group.append('input')
        .type("text")
        .id("branches")
        .class('input')
        .placeholder('main,develop')
        .required(true)
        .style("max-width", "250px")
        .on("focus", () => info(`Branches on Github: comma-separated list, one branch at least. Typically "main" or "master".`))
        .on("blur", () => info());
      })



  formRow2.append('div').class('label advanced').text("Advanced")
    .on("click", function() {
      const isCollapsed = formRow2.classed("collapsed");
      formRow2.classed("collapsed", !isCollapsed);
    })
    
  formRow2.append('div').class('form-col collapsable')
    .call((group) => {
      group.append('label').for('defaultbranch').class('label').text('Default branch')
      group.append('input')
        .type("text")
        .id("defaultbranch")
        .class('input')
        .placeholder('main')
        .style("max-width", "100px")
        .on("focus", () => info(`Default branch: must be one of the above listed branches. If unspecified, the first one counts as default.`))
        .on("blur", () => info());
    })

  formRow2.append('div').class('form-col collapsable form-grow');

  formRow2.append('div').class('form-col collapsable')
    .call((group) => {
      group.append('label').for('waffle_fetcher_id').class('label').html(WAFFLE_FETCHER_LINK + ' installation id')
      group.append('input')
        .type("text")
        .id("waffle_fetcher_id")
        .class('input')
        .placeholder('12345678')
        .style("max-width", "100px")
        .on("focus", () => info(`Waffle Fetcher is needed to read private Github repositories. Follow the link, install the app into your Github organization and give it access to the desired repositories. <br/> Then go to your Github org Settings->Github Apps->waffle-fetcher and copy the numeric installation ID from URL.`))
        .on("blur", () => info());
    })

  formRow2.append('div').class('form-col collapsable')
    .call((group) => {
      group.append('input')
        .type("checkbox")
        .id("private")
        .property('checked', false)
        .on("focus", () => info(`Enable private serving of this data from waffle server, regardless its private/public status on github. TODO (remind angie): You will become the owner and will be able to delegate the access rights further.`))
        .on("blur", () => info());
      group.append('label').for('private').class('label').text('Make dataset 🔒 private and assume ownership');
    })


  formRow3.append('button')
      .type("submit")
      .class('button addnew')
      .text('Add this dataset');

  

  formEl.on('submit', async (e) => {
    e.preventDefault();

    const slug = formEl.select('#slug').property('value').trim();
    if (!slugPattern.test(slug)) 
      return bad(`Slug didn't pass the vibe check`); //❌

    if(datasets?.map(m => m.slug)?.includes(slug)) 
      return bad(`Slug already taken on the server. Trying to add a branch? Use + button where branches are`); //❌

    const githubRaw = formEl.select('#github').property('value').trim();
    const github_repo_id = parseGithubLinkOrRepo(githubRaw);
    if (!github_repo_id) 
      return bad(`GitHub link or ID didn't pass the vibe check`); //❌

    if(datasets?.map(m => m.githubRepoId)?.includes(github_repo_id)) 
      return bad(`The specified github owner/repo is already on the server. Trying to add a branch? Use + button where branches are`); //❌

    const branchesRaw = formEl.select('#branches').property('value').trim();
    const branches = sanitizeBranchList(branchesRaw);
    if (!branches) 
      return bad(`Branches didn't pass the vibe check`); //❌

    const default_branch = formEl.select('#defaultbranch').property('value').trim() || null;
    if(default_branch && !branchPattern.test(default_branch)) 
      return bad(`[Optional field] Default branch doesn't pass the vibe check`); //❌

    if(default_branch && !branches.split(',').includes(default_branch)) 
      return bad(`Default branch must be mentioned in branches or left empty`); //❌

    const waffleFetcherID = formEl.select('#waffle_fetcher_id').property('value').trim() || null;    
    if(waffleFetcherID && !numericPattern.test(waffleFetcherID)) 
      return bad(`Waffle Fetcher installation ID must be numeric or empty`); //❌

    const is_private = !!formEl.select('#private').property('checked');

    const { error } = await action({
      id: slug, 
      github_repo_id, 
      branches, 
      default_branch, 
      is_private, 
      waffle_fetcher_app_installation_id: waffleFetcherID
    });
    if (error) return bad(error.message || "Didn't succeed adding the dataset"); //❌
    
    good('Dataset adding scheduled!'); //✅
    setTimeout(() => {
      info(); 
      formEl.style("visibility", "hidden").selectAll("div").remove();
      onFormDestroy();
      if (!error) onActionSuccess();
    }, 500);
  });
}
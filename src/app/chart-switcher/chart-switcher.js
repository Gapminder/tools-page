// function getLink(id) {
//   return `${window.location.pathname}#$chart-type=${id}`;
// }

const ChartSwitcher = function({ dom, translator, state, data, getTheme}) {
  const template = `
    <div class="chart-switcher">
      <a class="chart-switcher-button"></a>
    </div>
    <div class="chart-switcher-options"></div>
  `;

  const CLASS = "ChartSwitcher";
  const theme = getTheme(CLASS) || {};
  const placeHolders = d3.selectAll(dom);
  if(!placeHolders || placeHolders.empty()) return;   
  placeHolders.html(template);
  if(theme.style)
    Object.entries(theme.style).forEach( ([key, value]) => placeHolders.style(key, value) );
  
  const items = placeHolders.select(".chart-switcher-options")
    .selectAll("div")
    .data(data.filter(f => f.tool))
    .join("div")
    .html(`<a rel="noopener"></a>`) //href="${tool.url || getLink(tool.id)}"
    .on("click", (event, d) => {
      toggleMenu.call(this, false);
      state.setTool(d.id);
    });

  translate();
  updateSelected();

  state.dispatch.on("translate.chartSwitcher", translate);

  state.dispatch.on("toolChanged.chartSwitcher", ({ id }) => {
    updateSelected(id);
    translate();
  });

  function translate() {
    const activeTool = data.find(({ id }) => id === state.getTool());
    placeHolders.selectAll(".chart-switcher-button")
      .text(translator(activeTool.title || activeTool.id) || (activeTool.title || activeTool.id));
    placeHolders.selectAll(".chart-switcher-options div")
      .select("a").text(d => translator(d.title || d.id) || (d.title || d.id));
  }

  function updateSelected(id = state.getTool()) {
    items.classed("selected", d => d.id === id);
    //placeHolders.selectAll(".lang-current").text(translator(id));
  }

  // MENU OPENING LOGIC
  // open menu
  const switchers = placeHolders.select(".chart-switcher-button")
    .on("click", () => toggleMenu());

  let isMenuOpen = false;

  // hide menu on resize or click outside
  d3.select(window).on("resize.chartSwitcher", () => toggleMenu(false));
  d3.select(window).on("click.chartSwitcher", event => {
    if (isMenuOpen && event.target && !switchers.nodes().includes(event.target))
      toggleMenu(false);
  });

  function toggleMenu(force) {
    isMenuOpen = force ?? !isMenuOpen;
    placeHolders.selectAll(".chart-switcher-options").classed("open", isMenuOpen);
  }

};

export default ChartSwitcher;

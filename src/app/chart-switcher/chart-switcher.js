// function getLink(id) {
//   return `${window.location.pathname}#$chart-type=${id}`;
// }

const ChartSwitcher = function({ dom, translator, state, data, getTheme}) {
  const template = `
    <div class="chart-switcher">
      <a class="chart-switcher-button"></a>
    </div>
    <div class="chart-switcher-options" hidden></div>
  `;

  const CLASS = "ChartSwitcher";
  const theme = getTheme(CLASS) || {};
  const placeHolder = d3.select(dom);
  if(!placeHolder || placeHolder.empty()) return;   
  placeHolder.html(template);
  if(theme.style)
    Object.entries(theme.style).forEach( ([key, value]) => placeHolder.style(key, value) );
  
  const items = placeHolder.select(".chart-switcher-options")
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

  state.dispatch.on("translate.chartSwitcher", () => {
    translate();
  });

  state.dispatch.on("toolChanged.chartSwitcher", ({ id, previousToolId }) => {
    updateSelected(id);
    translate();
  });

  function translate() {
    const activeTool = data.find(({ id }) => id === state.getTool());
    placeHolder.select(".chart-switcher-button")
      .text(translator(activeTool.title || activeTool.id) || (activeTool.title || activeTool.id));
    placeHolder.selectAll(".chart-switcher-options div")
      .select("a").text(d => translator(d.title || d.id) || (d.title || d.id));
  }

  function updateSelected(id = state.getTool()) {
    items.classed("selected", d => d.id === id);
  }

  // MENU OPENING LOGIC
  // open menu
  const switcher = placeHolder.select(".chart-switcher-button")
    .on("click", () => toggleMenu.call(this));

  // hide menu on resize or click outside
  d3.select(window).on("resize.chartSwitcher", () => toggleMenu.call(this, false));
  d3.select(window).on("click.chartSwitcher", event => {
    if (this.isMenuOpen && event.target && (event.target !== switcher.node())) {
      toggleMenu.call(this, false);
    }
  });

  function toggleMenu(show) {
    this.isMenuOpen = (show === true || show === false) ? show : !this.isMenuOpen;
    placeHolder.select(".chart-switcher-options").attr("hidden", this.isMenuOpen ? null : true);
  }

};

export default ChartSwitcher;

import { getState } from "../../core/global.js";

// function getLink(id) {
//   return `${window.location.pathname}#$chart-type=${id}`;
// }

const ChartSwitcher = function({ dom, translator, dispatch, data, switchTool }) {
  const template = `
    <div class="chart-switcher">
      <a class="chart-switcher-button"></a>
    </div>
    <div class="chart-switcher-options" hidden></div>
  `;

  const placeHolder = d3.select(dom).html(template);
  const items = placeHolder.select(".chart-switcher-options")
    .selectAll("div")
    .data(data.filter(f => f.tool))
    .join("div")
    .html(`<a rel="noopener"></a>`) //href="${tool.url || getLink(tool.id)}"
    .on("click", (event, d) => {
      toggleMenu.call(this, false);
      switchTool(d.id);
    });

  translate();
  updateSelected();

  dispatch.on("translate.chartSwitcher", () => {
    translate();
  });

  dispatch.on("toolChanged.chartSwitcher", id => {
    updateSelected(id);
    translate();
  });

  function translate() {
    const selectedToolConfig = data.find(({ id }) => id === getState("tool"));
    placeHolder.select(".chart-switcher-button")
      .text(translator(selectedToolConfig.title || selectedToolConfig.id));
    placeHolder.selectAll(".chart-switcher-options div")
      .select("a").text(d => translator(d.title || d.id));
  }

  function updateSelected(id = getState("tool")) {
    items.classed("selected", d => d.id === id);
  }

  // MENU OPENING LOGIC
  // open menu
  const switcher = placeHolder.select(".chart-switcher-button")
    .on("click", () => toggleMenu.call(this));

  // hide menu on resize or click outside
  d3.select(window).on("resize.chartSwitcher", () => toggleMenu.call(this, false));
  d3.select(window).on("click.chartSwitcher", event => {
    if (this.areToolsOpen && event.target && (event.target !== switcher.node())) {
      toggleMenu.call(this, false);
    }
  });

  function toggleMenu(show) {
    this.areToolsOpen = (show === true || show === false) ? show : !this.areToolsOpen;
    placeHolder.select(".chart-switcher-options").attr("hidden", this.areToolsOpen ? null : true);
  }

};

export default ChartSwitcher;

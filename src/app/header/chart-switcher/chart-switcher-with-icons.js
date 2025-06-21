import * as utils from "../../core/utils";
import * as icons from "../../core/icons.js"

const ChartSwitcherWithIcons = function({ dom, translator, state, data }) {
  const template = `<div class="chart-switcher"></div>`;

  const placeHolder = d3.select(dom).html(template);
  const items = placeHolder.select(".chart-switcher")
    .selectAll("a")
    .data(data.filter(f => f.tool && !f.hideThumbnail))
    .join("a")
    .each(function(d){
      const view = d3.select(this)
      view.html(d.icon_inline ? icons[d.icon_inline] : `<img src="${d.icon}"/>`)
      view.append("span").attr("data-text", d.id)
    })
    .on("click", (event, d) => {
      if (state.getTool() === d.id) return;
      state.setTool(d.id);
    });

  translate();
  updateSelected();

  state.dispatch.on("translate.chartSwitcher", () => {
    translate();
  });

  state.dispatch.on("toolChanged.chartSwitcher", ({ id, previousToolId }) => {
    updateSelected(id);
  });

  function translate() {
    placeHolder.selectAll("a span").each(utils.translateNode(translator));
  }

  function updateSelected(id = state.getTool()) {
    items.classed("selected", d => d.id === id);
  }


};

export default ChartSwitcherWithIcons;

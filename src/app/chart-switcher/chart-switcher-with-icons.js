import * as utils from "../core/utils";
import * as icons from "../core/icons.js"

const ChartSwitcherWithIcons = function({ dom, translator, state, data, getTheme }) {
  const template = `<div class="chart-switcher"></div>`;

  const CLASS = "ChartSwitcherWithIcons";
  const theme = getTheme(CLASS) || {};
  const placeHolders = d3.selectAll(dom);
  if(!placeHolders || placeHolders.empty()) return;   
  placeHolders.html(template);
  if(theme.style)
    Object.entries(theme.style).forEach( ([key, value]) => placeHolders.style(key, value) );
  
  const items = placeHolders.select(".chart-switcher")
    .selectAll("a")
    .data(data.filter(f => f.tool && !f.hide_thumbnail))
    .join("a")
    .each(function(d){
      const view = d3.select(this)
      view.html(d.icon_inline ? icons[d.icon_inline] : `<img src="${d.icon}"/>`)
      view.append("span").attr("data-text", d.tool_id)
    })
    .on("click", (event, d) => {
      if (state.getTool() === d.tool_id) return;
      state.setTool(d.tool_id);
    });

  translate();
  updateSelected();

  state.dispatch.on("translate.chartSwitcherWithIcons", translate);

  state.dispatch.on("toolChanged.chartSwitcherWithIcons", ({ id }) => {
    updateSelected(id);
  });

  function translate() {
    placeHolders.selectAll("a span").each(utils.translateNode(translator));
  }

  function updateSelected(id = state.getTool()) {
    items.classed("selected", d => d.tool_id === id);
  }


};

export default ChartSwitcherWithIcons;

import {translateNode} from "../core/utils";
import * as icons from "../core/icons.js";
import { resolveAssetUrl } from "../core/utilsForAssetPaths.js";

const Menu = function({ getTheme, translator, state, dom, data}) {
  const template = `<div class="menu-items"></div>`;

  const CLASS = "Menu";
  const theme = getTheme(CLASS) || {};
  const placeHolders = d3.selectAll(dom);
  if(!placeHolders || placeHolders.empty()) return;   
  placeHolders.html(template);
  if(theme.style)
    Object.entries(theme.style).forEach( ([key, value]) => placeHolders.style(key, value) );


  placeHolders.select(".menu-items").selectAll(".menu-item")
    .data(data?.children || [], d => d.id)
    .join("div")
    .attr("class", "menu-item")
    .each(function(itemGroupData){
      const item = d3.select(this);
      
      const iconHeading = item.append("div").attr("class", "icon-heading-pair")
        .on("click", () => { selectMenuItem(itemGroupData) });
      if(itemGroupData.icon)
        iconHeading.append("span")
          .attr("class", "icon")
          .html(icons[itemGroupData.icon] || `<img src="${resolveAssetUrl(itemGroupData.icon)}"/>`);
      iconHeading.append("a")
          .attr("class", "heading")
          .attr("data-text", itemGroupData.heading);

      item.append("div")
        .attr("class", "expanded")
        .selectAll("div")
        .data(itemGroupData?.children || [], d => d.id)
        .join("a")
        .attr("href", d => d.url || "")
        .append("div")
        .attr("class", "grid-item")
        .each(function(itemData){
          const view = d3.select(this);
          if (itemData.icon) view.append("div").attr("class", "icon").html(icons[itemData.icon] || `<img src="${resolveAssetUrl(itemData.icon)}"/>`);

          const text = view.append("div").attr("class", "text")
          if (itemData.heading) text.append("div").attr("class", "heading").attr("data-text", itemData.heading);
          if (itemData.caption) text.append("div").attr("class", "caption").attr("data-text", itemData.caption);
        });
    });




  let selectedMenuItem = null;
  function selectMenuItem(item = selectedMenuItem) {
    selectedMenuItem = item;
    placeHolders.selectAll(".menu-item").classed("active", d => d === item);
  }

  state.dispatch.on("menuClose", () => {
    selectMenuItem(null);
  });

  translate();
  state.dispatch.on("translate.menu", translate);
  function translate() {
    placeHolders.selectAll(".heading").each(translateNode(translator));
    placeHolders.selectAll(".caption").each(translateNode(translator));
  }
};

export default Menu;

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


  const sections = (data?.children || []).filter(section => section.showSubmenu !== true || section.children?.length);
  placeHolders.select(".menu-items").selectAll(".menu-item")
    .data(sections, d => d.id)
    .join("div")
    .attr("class", "menu-item")
    .each(function(itemGroupData){
      const item = d3.select(this);
      const children = itemGroupData.children || [];
      const directUrl = itemGroupData.showSubmenu !== true && children.length === 1 && children[0].url;

      const iconHeading = item.append(directUrl ? "a" : "div").attr("class", "icon-heading-pair");
      if (directUrl) {
        iconHeading.attr("href", directUrl);
      } else {
        const mobile = this.closest(".too-mobile-menu") !== null;
        if (!mobile) {
          item.on("pointerenter", event => {
            if (event.pointerType === "mouse") selectMenuItem(this);
          }).on("pointerleave", event => {
            if (event.pointerType === "mouse" && selectedMenuItem === this) selectMenuItem(null);
          });
        }
        iconHeading.on("pointerup", event => {
          if (event.button !== 0) return;
          if (!mobile && event.pointerType === "mouse") return;
          selectMenuItem(selectedMenuItem === this ? null : this);
        });
      }
      if(itemGroupData.icon)
        iconHeading.append("span")
          .attr("class", "icon")
          .html(icons[itemGroupData.icon] || `<img src="${resolveAssetUrl(itemGroupData.icon)}"/>`);
      iconHeading.append(directUrl ? "span" : "a")
          .attr("class", "heading")
          .attr("data-text", itemGroupData.heading);

      if (directUrl) return;

      item.append("div")
        .attr("class", "expanded")
        .selectAll("div")
        .data(children, d => d.id)
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
  function selectMenuItem(item) {
    if (selectedMenuItem) d3.select(selectedMenuItem).classed("active", false);
    selectedMenuItem = item;
    if (item) d3.select(item).classed("active", true);
  }

  d3.select(document).on("pointerdown.menu", event => {
    if (selectedMenuItem && !selectedMenuItem.contains(event.target)) selectMenuItem(null);
  }, { capture: true });

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

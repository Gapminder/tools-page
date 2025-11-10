import * as utils from "../core/utils";
import * as icons from "../core/icons.js"
import { resolveAssetUrl } from "../core/utilsForAssetPaths.js";

const Footer = function({ dom, translator, state, getTheme, data }) {
  const template = `
    <div class="menu-holder">
      <div class="bottom-header"></div>
      <div class="bottom-text"></div>
      <div class="line1"></div>
      <div class="line2"></div>
    </div>
    <div class="logos-holder"></div>

  `;

  const CLASS = "Footer";
  const theme = getTheme(CLASS) || {};
  const placeHolder = d3.select(dom);
  if(!placeHolder || placeHolder.empty()) return;   
  placeHolder.html(template);
  const style = theme.style || {display: "none"};
  if(style) Object.entries(style).forEach( ([key, value]) => placeHolder.style(key, value) );
  

  if(theme.heading)
    placeHolder.select(".bottom-header").attr("data-text", theme.heading);
  if(theme.caption)
    placeHolder.select(".bottom-text").attr("data-text", theme.caption);

  if(data.links) {
    placeHolder.select(".line1").selectAll("a")
      .data(data.links.filter(f => f.line === 1 || !f.line))
      .join("a")
      .attr("href", d => d.url || "")
      .attr("data-text", d => d.text || "");

    placeHolder.select(".line2").selectAll("a")
      .data(data.links.filter(f => f.line === 2 || !f.line))
      .join("a")
      .attr("href", d => d.url || "")
      .attr("data-text", d => d.text || "");
  }

  if(data.logos)
    placeHolder.select(".logos-holder").selectAll("a")
      .data(data.logos.filter(f => f.image))
      .join("a")
      .attr("href", d => d.url || "")
      .html(d => icons[d.image] || `<img src="${resolveAssetUrl(d.image)}"/>`)
      .each(function(d) {
        const view = d3.select(this);
        if(d.style)
          Object.entries(d.style).forEach( ([key, value]) => view.style(key, value) );
      });

  translate();
  state.dispatch.on("translate.footer", translate);

  function translate() {
    placeHolder.select(".bottom-header").each(utils.translateNode(translator));
    placeHolder.select(".bottom-text").each(utils.translateNode(translator));
    placeHolder.selectAll(".line1 a").each(utils.translateNode(translator));
    placeHolder.selectAll(".line2 a").each(utils.translateNode(translator));
  }

};

export default Footer;

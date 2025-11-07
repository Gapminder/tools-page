import * as utils from "../core/utils.js"
import * as icons from "../core/icons.js"

const Logo = function({ translator, dom, getTheme, state }) {
  const template = `<span class="image"></span><a class="text"></a>`;
  
  const CLASS = "Logo";
  const theme = getTheme(CLASS) || {};
  const placeHolder = d3.select(dom);
  if(!placeHolder || placeHolder.empty()) return;   
  placeHolder.html(template);
  if(theme.style)
    Object.entries(theme.style).forEach( ([key, value]) => placeHolder.style(key, value) );

  const imageEl = placeHolder.select(".image");
  const textEl = placeHolder.select(".text");

  const { image, text, textHover, url, resetStateOnClick } = theme;
  if(image) 
    imageEl.html(icons[image] || `<img src="${image}"/>`);
  if(text) {
    textEl.attr("data-text", text);
    translate();
  }
  if(url) 
    textEl.attr("href", url);
  if(resetStateOnClick)
    placeHolder.on("click", state.resetState );

  translate();
  state.dispatch.on("translate.logo", translate);

  function translate() {
    textEl.each(utils.translateNode(translator));
  }
};

export default Logo;

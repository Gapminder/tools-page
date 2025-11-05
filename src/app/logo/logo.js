import * as utils from "../core/utils";
import * as icons from "../core/icons.js"

const Logo = function({ dom, getTheme, state }) {
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

  if(theme.image) 
    imageEl.html(icons[theme.image] || `<img src="${theme.image}"/>`);
  if(theme.text) 
    textEl.text(theme.text);
  if(theme.url) 
    textEl.attr("href", theme.url);
  if(theme.resetStateOnClick)
    placeHolder.on("click", state.resetState );

};

export default Logo;

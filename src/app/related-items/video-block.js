
import {getVideoIframeHTMLTemplate, translateNode} from "../core/utils";

const VideoBlock = function({translator, dom, state, getTheme }) {
  const template = `
    <div class="related-heading"></div>
    <div class="video"></div>
  `;

  const CLASS = "VideoBlock";
  const theme = getTheme(CLASS) || {};
  const placeHolder = d3.select(dom);
  if(!placeHolder || placeHolder.empty()) return;   
  placeHolder.html(template);
  if(theme.style)
    Object.entries(theme.style).forEach( ([key, value]) => placeHolder.style(key, value) );

  placeHolder.style("display", theme.videoUrl ? null : "none");
  const videoEl = placeHolder.select(".video");
  const textEl = placeHolder.select(".related-heading");
  
  if(theme.text)
    textEl.attr("data-text", theme.text);

  if (theme.placeholderImageUrl)
    videoEl.append("img").attr("src", theme.placeholderImageUrl);
  
  if(theme.videoUrl)
    videoEl.on("click", () => videoEl.html(getVideoIframeHTMLTemplate(theme.videoUrl)) );

  translate();
  state.dispatch.on("translate.relatedItems", translate);

  function translate() {
    placeHolder.select(".related-heading").each(translateNode(translator));
  }
};

export default VideoBlock;


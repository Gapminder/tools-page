
import {getVideoIframeHTMLTemplate, translateNode} from "../core/utils";

const VideoBlock = function({translator, dom, state, getTheme }) {
  const template = `
    <div class="related-heading"></div>
    <div class="video"></div>
  `;

  const CLASS = "VideoBlock";
  const theme = getTheme(CLASS) || {};
  const placeHolder = d3.select(dom);
  if (placeHolder.empty()) return;
  if (!theme.videoUrl) {
    placeHolder.remove();
    return;
  }
  placeHolder.html(template);
  for (const [key, value] of Object.entries(theme.style || {})) {
    if (key !== "display") placeHolder.style(key, value);
  }
  const videoEl = placeHolder.select(".video");
  const textEl = placeHolder.select(".related-heading");
  
  if(theme.text)
    textEl.attr("data-text", theme.text);

  if (theme.placeholderImageUrl)
    videoEl.append("img").attr("src", theme.placeholderImageUrl);
  
  videoEl.on("click", () => videoEl.html(getVideoIframeHTMLTemplate(theme.videoUrl)));

  translate();
  state.dispatch.on("translate.videoBlock", translate);

  function translate() {
    placeHolder.select(".related-heading").each(translateNode(translator));
  }
};

export default VideoBlock;


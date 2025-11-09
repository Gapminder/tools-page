import {translateNode, getVideoIframeHTMLTemplate, stopEmbeddedVideo} from "../core/utils";
import { resolveAssetUrl } from "../core/utilsForAssetPaths.js";
import * as icons from "../core/icons.js";


const Howto = function({ getTheme, translator, state, dom, howtoDialogDom}) {
  const buttonTemplate = ` 
    <div class="icon-heading-pair">
      <span class="icon">${icons.ICON_VIDEO}</span>
      <a class="heading" data-text="how_to_use"></a>
    </div>
  `;

  const dialogTemplate = `
    <div class="howto-content">
      <a class="howto-close">✕</a>
      <div class="howto-video"></div>
      <p class="links"></p>
    </div>
  `

  const CLASS = "Howto";
  const theme = getTheme(CLASS) || {};
  const buttons = d3.selectAll(dom);
  if(!buttons || buttons.empty()) return;   
  buttons.html(buttonTemplate);
  if(theme.style)
    Object.entries(theme.style).forEach( ([key, value]) => buttons.style(key, value) );

  const dialog = d3.select(howtoDialogDom).html(dialogTemplate);

  if (theme.links && theme.links.length)
    dialog.select(".links").selectAll("a")
      .data(theme.links)
      .join("a")
      .attr("href", d => resolveAssetUrl(d.url))
      .attr("target", "_blank")
      .attr("data-text", d => d.text);

  translate();
  state.dispatch.on("translate.menu", translate);
  function translate() {
    buttons.selectAll("a").each(translateNode(translator));
    dialog.selectAll("a").each(translateNode(translator));
  }

  
  let isHowToOpen = false;

  buttons.on("click", () => toggleHowTo());

  dialog.select(".howto-close").on("click", () => toggleHowTo(false));

  //click exactly on greyed out area closes the dialog
  dialog.on("click", (event) => {
    if (event.target === dialog.node()) toggleHowTo(false);
  });
    

  function toggleHowTo(force) {
    isHowToOpen = force ?? !isHowToOpen;
    dialog.style("display", isHowToOpen ? "flex" : "none");
    const howtoContent = dialog.select(".howto-video");

    if (isHowToOpen && !howtoContent.select("iframe").size()) {
      if(theme.videoUrl) howtoContent.html(getVideoIframeHTMLTemplate(theme.videoUrl));
    }
    if (!isHowToOpen && howtoContent.select("iframe").size()) {
      stopEmbeddedVideo(howtoContent.node());
    }
  }
};

export default Howto;

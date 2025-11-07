import * as utils from "../core/utils";
import domtoimage from "dom-to-image-more";
import * as icons from "../core/icons.js"

const SocialButtons = function({ dom, translator, state, bitlyService, locationService, getTheme }) {
  const template = `
    <span class="share-text" data-text="share"></span>
    <span><a class="mail button">${icons.ICON_ENVELOPE}</a></span>
    <span><a class="twitter button">${icons.ICON_EXTWITTER}</a></span>
    <span><a class="facebook button">${icons.ICON_FACEBOOK}</a></span>
    <span><a class="link button">${icons.ICON_LINK}</a></span>
    <span><a class="download button">${icons.ICON_DOWNLOAD}</a></span>
    <span><a class="button code">${icons.ICON_CODE}</a></span>
  `;

  const CLASS = "SocialButtons";
  const theme = getTheme(CLASS) || {};
  const placeHolders = d3.selectAll(dom);
  if(!placeHolders || placeHolders.empty()) return;   
  placeHolders.html(template);
  if(theme.style)
    Object.entries(theme.style).forEach( ([key, value]) => placeHolders.style(key, value) );


  placeHolders.select(".mail.button")
    .on("click", mail)
    .select("svg").attr("width", "70%").attr("height", "70%");
  placeHolders.select(".twitter.button")
    .on("click", twitter)
    .select("svg").attr("width", "90%").attr("height", "90%");
  placeHolders.select(".facebook.button")
    .on("click", facebook)
    .select("svg").attr("width", "70%").attr("height", "70%");
  placeHolders.select(".link.button")
    .on("click", shareLink)
    .select("svg").attr("width", "70%").attr("height", "70%");
  placeHolders.select(".download.button")
    .on("click", download)
    .select("svg").attr("width", "70%").attr("height", "70%");
  placeHolders.select(".code.button")
    .on("click", getEmbeddedUrl)
    .select("svg").attr("width", "80%").attr("height", "80%");



  translate();
  state.dispatch.on("translate.socialButtons", translate);

  function translate() {
    placeHolders.select(".share-text").each(utils.translateNode(translator));
  }

  function twitter() {
    openWindow(`https://twitter.com/intent/tweet?url=#{url}`);
  }

  function facebook() {
    openWindow(`http://www.addtoany.com/add_to/facebook?linkurl=#{url}`);
  }

  function mail() {
    const body = window.location.href; // or a shortened URL if desired
    const href = utils.mailtoUrl({
      subject: theme.title || document.title || "",
      body
    });
    const win = window.open(href, "_blank");
    // Using location avoids popup blockers better than window.open
    if (!win) window.location.href = href; // fallback if blocked
  }



  function openWindow(urlTemplate) {
    const half = 2;
    const windowWidth = 490;
    const left = (window.innerWidth - windowWidth) / half;
    const newWindow = window.open("", "_blank", `width=${windowWidth}, height=368, top=100, left=${left}`);

    bitlyService.shortenUrl(undefined, url => {
      newWindow.location.href = urlTemplate.replace(/#{url}/g, url);
      newWindow.focus();
    });
  }

  function shareLink() {
    bitlyService.shortenUrl(undefined, shortened => prompt("Copy the following link: ", shortened));
  }

  function download() {
    domtoimage
      .toPng(d3.select(".vzb-placeholder > div").node(), {
        bgcolor: "#fff",
        filter: function (node) {
          return !node?.classList?.contains("vzb-noexport");
        }
      })
      .then(function (dataUrl) {
        const filename = d3.timeFormat("%Y-%m-%d at %H.%M.%S")(new Date())
          + " - " + state.getTool()
          + ".png";
        const anchor = document.createElement('a');
        anchor.download = filename;
        anchor.href = dataUrl;
        anchor.click();
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  }

  function getEmbeddedUrl() {
    const message = "Copy this fragment and paste it in your website or blog:\n(more instructions on vizabi.org/tutorials)";

    prompt(message, wrapInIFrame(locationService.getUrlReadyForEmbedding()));
  }

  function wrapInIFrame(content) {
    return `<iframe src="${content}" style="width: 100%; height: 500px; margin: 0 0 0 0; border: 1px solid grey;" allowfullscreen></iframe>`;
  }

};

export default SocialButtons;

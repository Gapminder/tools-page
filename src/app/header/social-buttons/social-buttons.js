import * as utils from "../../core/utils";
import "dom-to-image-more";
import * as icons from "../../core/icons.js"

const SocialButtons = function({ dom, translator, state, bitlyService, locationService }) {
  const templateHtml = `
    <li><div class="share-text-box" data-text="share"></div></li>
    <li><a class="mail button"></a></li>
    <li><a class="twitter button"></a></li>
    <li><a class="facebook button"></a></li>
    <li><a class="link button"></a></li>
    <li><a class="download button"></a></li>
    <li><a class="button code"></a></li>
    <a class="mailLink" href="#"></a>
  `;

  const placeHolder = d3.select(dom);
  const template = d3.create("div");
  template.html(templateHtml);

  template.select(".mail.button")
    .on("click", mail)
    .html(icons.ICON_ENVELOPE).select("svg").attr("width", "70%").attr("height", "70%");
  template.select(".twitter.button")
    .on("click", twitter)
    .html(icons.ICON_EXTWITTER).select("svg").attr("width", "90%").attr("height", "90%");
  template.select(".facebook.button")
    .on("click", facebook)
    .html(icons.ICON_FACEBOOK).select("svg").attr("width", "70%").attr("height", "70%");
  template.select(".link.button")
    .on("click", shareLink)
    .html(icons.ICON_LINK).select("svg").attr("width", "70%").attr("height", "70%");
  template.select(".download.button")
    .on("click", download)
    .html(icons.ICON_DOWNLOAD).select("svg").attr("width", "70%").attr("height", "70%");
  template.select(".code.button")
    .on("click", getEmbeddedUrl)
    .html(icons.ICON_CODE).select("svg").attr("width", "80%").attr("height", "80%");


  for (const elem of Array.from(template.node().children)) {
    placeHolder.append(() => elem);
  }

  translate();
  state.dispatch.on("translate.socialButtons", () => {
    translate();
  });

  function translate() {
    placeHolder.select(".share-text-box")
      .each(utils.translateNode(translator));
  }

  function twitter() {
    openWindow(`https://twitter.com/intent/tweet?url=#{url}`);
  }

  function facebook() {
    openWindow(`http://www.addtoany.com/add_to/facebook?linkurl=#{url}`);
  }

  function mail() {
    const mailUrl = encodeURIComponent(window.location.href);
    placeHolder.select(".mailLink")
      .attr("href", `mailto:?subject=Boendebarometern&body=${mailUrl}`)
      .node().click();
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

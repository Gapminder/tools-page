import * as utils from "../../core/utils";
import { saveSvg } from "../../core/download-utils.js";

const SocialButtons = function({dom, translator, state, bitlyService, locationService }) {
  const templateHtml = `
    <li>
      <div class="share-text-box" data-text="share"></div>
    </li>
    <li>
      <a class="mail button">
        <i class="fa fa-envelope-o"></i>
      </a>
    </li>
    <li>
      <a class="twitter button">
        <i class="fa fa-twitter"></i>
      </a>
    </li>
    <li>
      <a class="facebook button">
        <i class="fa fa-facebook"></i>
      </a>
    </li>
    <li>
      <a class="link button">
        <i class="fa fa-link"></i>
      </a>
    </li>
    <li>
      <a class="download button">
        <i class="fa fa-download"></i>
      </a>
    </li>
    <li>
      <a class="button code">
        <i class="fa fa-code"></i>
      </a>
    </li>
    <a class="mailLink" href="#"></a>
  `;
  //require("./social-buttons.html");

  const placeHolder = d3.select(dom);
  const template = d3.create("div");
  template.html(templateHtml);

  template.select(".share-text-box")
    .on("click", setMainLink);
  template.select(".mail.button")
    .on("click", mail);
  template.select(".twitter.button")
    .on("click", twitter);
  template.select(".facebook.button")
    .on("click", facebook);
  template.select(".link.button")
    .on("click", shareLink);
  template.select(".download.button")
    .on("click", download);
  template.select(".code.button")
    .on("click", getEmbeddedUrl);

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
    setMainLink();
    placeHolder.select(".mailLink").node().click();
  }

  function setMainLink() {
    const mailUrl = encodeURIComponent(window.location.href);
    placeHolder.select(".mailLink").attr("href", `mailto:?subject=Gapminder&body=${mailUrl}`);
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
    d3.selectAll(".vzb-export").each(function(_, i) {
      const filename = d3.timeFormat("%Y-%m-%d at %H.%M.%S")(new Date())
        + " - " + toolsPage_toolset.find(f => f.id == state.getTool()).title
        + " - " + (i + 1);

      saveSvg(d3.select(this), filename + ".svg");
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

import * as utils from "../../core/utils";

const SocialButtons = function (placeHolder, translator, dispatch, { bitlyService, locationService }) {
  const templateHtml = require("./social-buttons.html");

  const template = d3.create("div")
  template.html(templateHtml);

  template.select(".share-text-box")
    .on("click", setMainLink);
  template.select(".mail.button")
    .on("click", mail);
  template.select(".twitter.button")
    .on("click", twitter);
  template.select(".facebook.button")
    .on("click", facebook);
  template.select(".ico-plane.button")
    .on("click", shareLink);
  template.select(".ico-code.button")
    .on("click", getEmbeddedUrl);

  for (const elem of Array.from(template.node().children)) {
    placeHolder.append(function() { return elem;});
  }

  translate();
  dispatch.on("translate.socialButtons", () => {
    translate();
  });

  function translate() {
    placeHolder.select(".share-text-box")
      .each(utils.translateNode(translator));
  }

  function twitter() {
    openWindow(`https://twitter.com/intent/tweet?original_referer=#{url}&amp;related=Gapminder&amp;text=Gapminder&amp;tw_p=tweetbutton&amp;url=#{url}`);
  }

  function facebook() {
    openWindow(`http://www.addtoany.com/add_to/facebook?linkurl=#{url}&amp;`);
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
    const newWindow = window.open('', '_blank', `width=${windowWidth}, height=368, top=100, left=${left}`);

    bitlyService.shortenUrl(undefined, url => {
      newWindow.location.href = urlTemplate.replace(/#{url}/g, url);
      newWindow.focus();
    });
  }

  function shareLink() {
    bitlyService.shortenUrl(undefined, shortened => prompt('Copy the following link: ', shortened));
  }

  function getEmbeddedUrl() {
    const message = 'Copy this fragment and paste it in your website or blog:\n(more instructions on vizabi.org/tutorials)';

    prompt(message, wrapInIFrame(locationService.getUrlReadyForEmbedding()));
  }

  function wrapInIFrame(content) {
    return `<iframe src="${content}" style="width: 100%; height: 500px; margin: 0 0 0 0; border: 1px solid grey;" allowfullscreen></iframe>`;
  }
  
}

export default SocialButtons;
import * as utils from "../core/utils";

const Footer = function (placeHolder, translator, dispatch) {
  const templateHtml = require("./footer.html");

  const template = d3.create("div")
  template.html(templateHtml);

  for (const elem of Array.from(template.node().children)) {
    placeHolder.append(function() { return elem;});
  }

  translate();
  dispatch.on("translate.footer", () => {
    translate();
  });

  function translate() {
    placeHolder.selectAll("ul.nav li a")
      .each(utils.translateNode(translator));
  }

}

export default Footer;
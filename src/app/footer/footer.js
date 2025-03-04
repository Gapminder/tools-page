import * as utils from "../core/utils";

const Footer = function(placeHolder, translator, dispatch) {
  const templateHtml = `
    <div class="footer-container">
      <div class="footer-container menu-holder">

        <div class="general-menu">
          <ul class="nav">
            <li><a href="https://visual-encodings.com/" data-text="madeby"></a></li>
          </ul>
        </div>
          
      </div>
      <div class="logos-holder">
        <img src="assets/images/gapminder_word_logo.svg" height="30px">
      </div>

    </div>
  `;
  //require("./footer.html");

  const template = d3.create("div");
  template.html(templateHtml);

  for (const elem of Array.from(template.node().children)) {
    placeHolder.append(() => elem);
  }

  translate();
  dispatch.on("translate.footer", () => {
    translate();
  });

  function translate() {
    placeHolder.selectAll("ul.nav li a")
      .each(utils.translateNode(translator));
  }

};

export default Footer;

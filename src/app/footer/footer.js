import * as utils from "../core/utils";

const Footer = function({ dom, translator, state }) {
  const template = `
    <div class="footer-container">
      <div class="footer-container menu-holder">
        <div class="bottom-header" data-text="bottom-header"></div>
        <div class="bottom-text" data-text="bottom-text"></div>
        <div class="general-menu">
          <ul class="nav">
            <li>
            </li>
          </ul>
        </div>
          
      </div>
      <div class="logos-holder">
        <img src="assets/images/uu-logo-red.svg" height="120px">
        <img src="assets/images/lf_logo_rgb.png" height="80px">
        <img src="assets/images/gapminder_word_logo.svg" height="40px">
        <img src="assets/images/vizabi-charts-plainsvg.svg" height="120px" style="margin-bottom:20px">
      </div>

    </div>
  `;

  const placeHolder = d3.select(dom).html(template);

  translate();
  state.dispatch.on("translate.footer", () => {
    translate();
  });

  function translate() {
    placeHolder.select(".bottom-header").each(utils.translateNode(translator));
    placeHolder.select(".bottom-text").each(utils.translateNode(translator));
    placeHolder.selectAll("ul.nav li span").each(utils.translateNode(translator));
  }

};

export default Footer;

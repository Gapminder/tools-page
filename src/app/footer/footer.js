import * as utils from "../core/utils";

const Footer = function(placeHolder, translator, dispatch) {
  const templateHtml = `
    <div class="footer-container">
      <div class="footer-container menu-holder">
        <div class="bottom-header">BOENDEBAROMETERN</div>
        <div class="bottom-text">«The world cannot be understood without numbers, and it cannot be understood with numbers alone. Love numbers for what they tell you about real lives.» — Hans Rosling</div>
        <div class="general-menu">
          <ul class="nav">
            <li>
              <span data-text="madeby"></span>
              <a href="https://visual-encodings.com/">Visual Encodings AB</a>
              <span data-text="incollabwith"></span>
              <a href="https://www.gapminder.org/">Gapminder</a>
              <span data-text="supportedby"></span>
              <a href="https://www.lansforsakringar.se/uppsala/foretag/om-oss/">Länsförsäkringar</a>
              <span data-text="assignmentby"></span>
              <a href="https://www.uu.se/institution/bostads-och-urbanforskning">Institutet för bostads- och urbanforskning (IBF)</a>
            </li>
          </ul>
        </div>
          
      </div>
      <div class="logos-holder">
        <img src="assets/images/lf_logo.svg" height="100px">
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
    placeHolder.selectAll("ul.nav li span")
      .each(utils.translateNode(translator));
  }

};

export default Footer;

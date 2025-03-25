import * as utils from "../core/utils";

const Footer = function({ dom, translator, state }) {
  const template = `
    <div class="footer-container">
      <div class="footer-container menu-holder">
        <div class="bottom-header">Om Boendebarometern</div>
        <div class="bottom-text">
          <p>
            Boendebarometern ger kunskap om de sociala, ekonomiska och miljömässiga aspekterna av boende på grannskapsnivå i Sverige över tid.
          </p>
          <p>
            Den bygger på statistik från SCB och har utvecklats av
            <a href="https://www.uu.se/institution/bostads-och-urbanforskning/" target="_blank">Institutet för bostads- och urbanforskning (IBF)</a>
            vid Uppsala universitet i samarbete med
            <a href="https://www.lansforsakringar.se/stockholm/privat/om-oss/hallbarhet--forskning/forskning/om-forskningsfonden/" target="_blank">LFs Forskningsstiftelse</a>,
            <a href="https://www.gapminder.org/" target="_blank">Gapminder</a> 
            och <a href="https://visual-encodings.com/" target="_blank">Vizabi charts</a>
          </p>
          <p>
            Hör gärna av dig till IBF om du har frågor:  <a href="mailto:mattias.ohman@ibf.uu.se" target="_blank"> mattias.ohman@ibf.uu.se </a>         
          </p>
        </div>
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
    placeHolder.selectAll("ul.nav li span")
      .each(utils.translateNode(translator));
  }

};

export default Footer;

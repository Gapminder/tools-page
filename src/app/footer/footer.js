import * as utils from "../core/utils";

const Footer = function({ dom, translator, state }) {
  const template = `
    <div class="footer-container">
      <div class="footer-container menu-holder">
        <div class="bottom-header">Om Boendebarometern</div>
        <div class="bottom-text">
          <p>
            Boendebarometern ger kunskap om de sociala, ekonomiska och miljömässiga aspekterna av
            boende på grannskapsnivå i Sverige över tid. Den bygger på statistik från SCB och har
            utvecklats av Institutet för bostads- och urbanforskning (IBF) vid Uppsala universitet i
            samarbete med LFs Forskningsstiftelse. 
          </p>
          <!--
          <p>
            När du tolkar statistiken är det viktigt att ha följande i åtanke:
          </p>
          <p>
          1. Korrelation betyder inte kausalitet. I Boendebarometern kan du se samband mellan
          olika variabler, men det innebär inte nödvändigtvis att det ena orsakar det andra. Två
          relaterade utfall kan exempelvis bero på en tredje faktor eller på slumpen. För att
          fastställa orsakssamband krävs ytterligare kunskap.
          </p>
          <p>
          2. Var försiktig med att dra generella slutsatser från enskilda RegSO-områden. Dessa
          områden är små, och lokala faktorer kan ha stor påverkan på resultaten.
          </p>
          <p>
          3. Statistiken från SCB håller generellt hög kvalitet, men vissa fel kan förekomma. Vi
          reserverar oss därför för eventuella avvikelser.
          </p>
          <p>
          Hör gärna av dig till IBF om du har frågor: mattias.ohman@ibf.uu.se
          </p>
          -->

          <p>
            Datavisualiseringsverktyg utvecklas och underhålls av <a href="https://visual-encodings.com/">Visual Encodings AB</a> i samarbete med <a href="https://www.gapminder.org/">Gapminder</a>
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
        <img src="assets/images/lf_logo.svg" height="80px">
        <img src="assets/images/gapminder_word_logo.svg" height="40px">
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

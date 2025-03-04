import * as utils from "../core/utils";

const Footer = function(placeHolder, translator, dispatch) {
  const templateHtml = `
    <div class="footer-container">
        <div class="logos-holder">
            <img src="assets/images/gapminder_word_logo.svg" height="30px">
        </div>
        <div class="footer-container menu-holder">
            <div class="general-menu">
                <ul class="nav">
                    <!--li><a href="//gapminder.org/world/?use_gapminder_world" data-text="old_bubble_chart"></a></li-->
                    <li><a href="//gapminder.org/for-teachers/" data-text="for_teachers"></a></li>
                    <li><a href="https://docs.google.com/document/d/1bzTWStFYAq2Oj9kV3vm261Dj9FW8C2tS7Jwj1wtTn1Q" data-text="help_to_translate"></a></li>
                </ul>
            </div>
            <div class="main-menu">
                <ul class="nav">
                    <li><a href="//gapminder.org/about/" data-text="about"></a></li>
                    <li><a href="//gapminder.org/about/press-room/contact/" data-text="contact"></a></li>
                    <li><a href="//gapminder.org/news/" data-text="blog"></a></li>
                    <li><a href="//gapminder.org/donations/" data-text="donate"></a></li>
                    <li><a href="//gapminder.org/privacy/terms-of-use/" data-text="terms"></a></li>
                    <li><a href="//gapminder.org/about/press-room/" data-text="media"></a></li>
                    <li><a href="//gapminder.org/faq_frequently_asked_questions/" data-text="help"></a></li>
                    <li><a href="//vizabi.org/tutorials/" data-text="labs"></a></li>
                    <li><a href="//github.com/Gapminder/tools-page/issues" data-text="report_problem"></a></li>
                </ul>
            </div>
        </div>          
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

const LanguageSwitcher = function (placeHolder, translator, { languages, selectedLanguage, onClick }) {
  const templateHtml = require("./language-switcher.html");

  const template = d3.create("div")
  template.html(templateHtml);

  const itemTemplate = template.select("ul li");
  for (let language of languages) {
    itemTemplate.clone(true)
      .datum(language)
      .raise()
      .on("click", (d) => {
        switcher.text(d.text);
        switchLanguage.call(this);
        onClick(d);
      })
      .text((d) => d.text);
  }
  itemTemplate.remove();

  this.isLanguageSwitcherVisible = false;
  const selectedLanguageConfig = languages.filter(({key}) => key === selectedLanguage)[0];
  const switcher = template.select(".lang-current");
  switcher.on("click", () => switchLanguage.call(this));
  switcher.text(selectedLanguageConfig.text);

  for (const elem of Array.from(template.node().children)) {
    placeHolder.append(function() { return elem;});
  }

  d3.select(window).on("resize.languageSwitcher", () => switchLanguage.call(this, false));
  d3.select(window).on("click.languageSwitcher", () => {
    const event = d3.event;
    if (this.isLanguageSwitcherVisible && event.target && (event.target !== switcher.node())) {
      switchLanguage.call(this, false);
    }
  });

  function switchLanguage(force) {
    this.isLanguageSwitcherVisible = force || force === false ? force : !this.isLanguageSwitcherVisible;
    placeHolder.select("ul").attr("class", this.isLanguageSwitcherVisible ? "selected" : null);
  }

}

export default LanguageSwitcher;
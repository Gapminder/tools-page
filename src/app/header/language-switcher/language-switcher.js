
const LanguageSwitcher = function({dom, translator, state, data, swithLanguage}) {
  const template = `
    <div class="lang-current"></div>
    <ul hidden></ul>
  `;

  const placeHolder = d3.select(dom).html(template);

  const items = placeHolder.select("ul").selectAll("li")
    .data(data)
    .join("li")
    .text(d => translator(d))
    .on("click", (event, d) => {
      toggleMenu.call(this, false);
      swithLanguage(d);
    })

  updateSelected();

  state.dispatch.on("languageChanged.languageSwitcher", id => {
    updateSelected(id);    
  });

  function updateSelected(id = state.getState("locale")) {
    items.classed("selected", d => d === id);
    placeHolder.select(".lang-current")
      .text(translator(id));
  }


  // MENU OPENING LOGIC
  // open menu
  const switcher = placeHolder.select(".lang-current")
    .on("click", () => toggleMenu.call(this));

  // hide menu on resize or click outside
  d3.select(window).on("resize.languageSwitcher", () => toggleMenu.call(this, false));
  d3.select(window).on("click.languageSwitcher", event => {
    if (this.isMenuOpen && event.target && (event.target !== switcher.node())) {
      toggleMenu.call(this, false);
    }
  });

  function toggleMenu(show) {
    this.isMenuOpen = (show === true || show === false) ? show : !this.isMenuOpen;
    placeHolder.select("ul").attr("hidden", this.isMenuOpen ? null : true);
  }

};

export default LanguageSwitcher;

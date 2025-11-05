
const LanguageSwitcher = function({ dom, translator, state, data, getTheme }) {
  const template = `
    <div class="lang-wrapper">
      <div class="lang-current"></div>
      <ul hidden></ul>
    </div>
  `;

  const CLASS = "LanguageSwitcher";
  const theme = getTheme(CLASS) || {};
  const placeHolder = d3.select(dom);
  if(!placeHolder || placeHolder.empty()) return;   
  placeHolder.html(template);
  if(theme.style)
    Object.entries(theme.style).forEach( ([key, value]) => placeHolder.style(key, value) );

  const items = placeHolder.select("ul").selectAll("li")
    .data(data)
    .join("li")
    .text(d => translator(d))
    .on("click", (event, d) => {
      toggleMenu.call(this, false);
      state.setLocale(d);
    });

  updateSelected();

  state.dispatch.on("languageChanged.languageSwitcher", id => {
    updateSelected(id);
  });

  function updateSelected(id = state.getLocale()) {
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

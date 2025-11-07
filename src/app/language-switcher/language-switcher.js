
const LanguageSwitcher = function({ dom, translator, state, data, getTheme }) {
  const template = `
    <div class="lang-wrapper">
      <div class="lang-current"></div>
      <ul></ul>
    </div>
  `;

  const CLASS = "LanguageSwitcher";
  const theme = getTheme(CLASS) || {};
  const placeHolders = d3.selectAll(dom);
  if(!placeHolders || placeHolders.empty()) return;   
  placeHolders.html(template);
  if(theme.style)
    Object.entries(theme.style).forEach( ([key, value]) => placeHolders.style(key, value) );

  const items = placeHolders.select("ul").selectAll("li")
    .data(data)
    .join("li")
    .text(d => translator(d))
    .on("click", (event, d) => {
      toggleMenu(false);
      state.setLocale(d);
    });

  updateSelected();

  state.dispatch.on("languageChanged.languageSwitcher", id => {
    updateSelected(id);
  });

  function updateSelected(id = state.getLocale()) {
    items.classed("selected", d => d === id);
    placeHolders.selectAll(".lang-current").text(translator(id));
  }


  // MENU OPENING LOGIC
  // open menu
  const switchers = placeHolders.select(".lang-current")
    .on("click", () => toggleMenu());

  let isMenuOpen = false;

  // hide menu on resize or click outside
  d3.select(window).on("resize.languageSwitcher", () => toggleMenu(false));
  d3.select(window).on("click.languageSwitcher", event => {
    if (isMenuOpen && event.target && !switchers.nodes().includes(event.target))
      toggleMenu(false);
  });

  function toggleMenu(force) {
    isMenuOpen = force ?? !isMenuOpen;
    placeHolders.selectAll("ul").classed("open", isMenuOpen);
  }

};

export default LanguageSwitcher;


const MobileMenu = function({ getTheme, translator, state, dom, data, menuButtonDom }) {

  const CLASS = "MobileMenu";
  const theme = getTheme(CLASS) || {};
  const placeHolders = d3.select(dom);
  if(!placeHolders || placeHolders.empty()) return;   
  //placeHolders.html(template);
  if(theme.style)
    Object.entries(theme.style).forEach( ([key, value]) => placeHolders.style(key, value) );

  const button = d3.select(menuButtonDom).on("click", () => toggleMobileMenu());
  let isMobileMenuOpen = false;
  
  //click exactly on greyed out area closes the menu
  placeHolders.on("click", (event) => {
    if (event.target === placeHolders.node()) toggleMobileMenu(false)
  });
  d3.select(window).on("resize.mobileMenu", () => toggleMobileMenu(false));

  function toggleMobileMenu(force) {
    isMobileMenuOpen = force ?? !isMobileMenuOpen;
    placeHolders.classed("open", isMobileMenuOpen);
    button.classed("open", isMobileMenuOpen);
    state.dispatch.call(isMobileMenuOpen ? "menuOpen" : "menuClose");
  }

};

export default MobileMenu;

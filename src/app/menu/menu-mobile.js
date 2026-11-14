
const MobileMenu = function({ getTheme, state, dom, header }) {

  const CLASS = "MobileMenu";
  const theme = getTheme(CLASS) || {};
  const placeHolders = d3.select(dom);
  if (placeHolders.empty() || !placeHolders.node().children.length) return;
  if(theme.style)
    Object.entries(theme.style).forEach( ([key, value]) => placeHolders.style(key, value) );

  const button = header.empty()
    ? d3.select(placeHolders.node().parentNode).insert("button", dom)
    : header.append("button");
  button.attr("type", "button").attr("class", "hamburger-button")
    .attr("aria-label", "Menu").attr("aria-expanded", "false")
    .on("click", () => toggleMobileMenu());
  button.append("span").attr("class", "icon");
  let isMobileMenuOpen = false;
  
  //click exactly on greyed out area closes the menu
  placeHolders.on("click", (event) => {
    if (event.target === placeHolders.node()) toggleMobileMenu(false)
  });
  d3.select(window).on("resize.mobileMenu", () => toggleMobileMenu(false));

  function toggleMobileMenu(force) {
    isMobileMenuOpen = force ?? !isMobileMenuOpen;
    placeHolders.classed("open", isMobileMenuOpen);
    button.classed("open", isMobileMenuOpen).attr("aria-expanded", isMobileMenuOpen);
    state.dispatch.call(isMobileMenuOpen ? "menuOpen" : "menuClose");
  }

};

export default MobileMenu;

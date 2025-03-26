
const MobileMenu = function({ translator, state, dom,  data, menuButton }) {

  const button = d3.select(menuButton).on("click", toggleMobileMenu);
  let isMobileMenuOpen = false;

  d3.select(window).on("resize.mobileMenu", () => toggleMobileMenu(false));

  function toggleMobileMenu(force) {
    isMobileMenuOpen = force ?? !isMobileMenuOpen;
    //menu.classed("open", isMobileMenuOpen);
    button.classed("open", isMobileMenuOpen);
  }

};

export default MobileMenu;

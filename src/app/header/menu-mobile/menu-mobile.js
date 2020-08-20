
const MobileMenu = function(placeHolder, translator, dispatch, { menu }) {

  this.isMobileMenuOpen = false;
  placeHolder.on("click", () => switchMobileMenu.call(this));

  d3.select(window).on("resize.mobileMenu", () => switchMobileMenu.call(this, false));

  function switchMobileMenu(force) {
    this.isMobileMenuOpen = force || force === false ? force : !this.isMobileMenuOpen;
    menu.classed("open", this.isMobileMenuOpen);
    placeHolder.classed("open", this.isMobileMenuOpen);
  }

};

export default MobileMenu;

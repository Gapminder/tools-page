import {translateNode, getVideoIframeHTMLTemplate} from "../core/utils";
import * as icons from "../core/icons.js";


const Menu = function({ dom, translator, state, data, menuButton, mobileMenuContainer, getTheme}) {
  const template = ` 
    <div class="menu-items"></div>
    <div class="howto-outer">
      <div class="how-to-content">
        <span class="how-to-close button-close">&times;</span>
        <div class="howToContent"></div>
        <p class="nav-faq-help-links">
          <a target="_blank" href="assets/guide.pdf" data-text="pdf_guide"></a>
          <a target="_blank" href="https://vizabi.com" data-text="can_i_show_my_own_data"></a>
        </p>
      </div>
    </div>
  `;

  const CLASS = "Menu";
  const theme = getTheme(CLASS) || {};
  const placeHolder = d3.select(dom);
  if(!placeHolder || placeHolder.empty()) return;   
  placeHolder.html(template);
  if(theme.style)
    Object.entries(theme.style).forEach( ([key, value]) => placeHolder.style(key, value) );

  
  const mobileMenu = d3.select(mobileMenuContainer);
  const howToOuter = placeHolder.select(".howto-outer");
  let isHowToOpen = false;
  let isMobileMenuOpen = false;
  this.selectedMenuItem = null;

  const menuList = placeHolder.select(".menu-items").selectAll(".menu-item")
    .data(data?.children || [], d => d.id)
    .join("div")
    .attr("class", "menu-item")
    .each(function(itemGroupData){
      const item = d3.select(this);
      
      const image = item.append("span").attr("class", "icon");
      if(itemGroupData.icon)
        image.html(icons[itemGroupData.icon] || `<img src="${itemGroupData.icon}"/>`);

      item.append("a").attr("class", "heading").attr("data-text", itemGroupData.heading);

      item.append("div")
        .attr("class", "expanded")
        .selectAll("div")
        .data(itemGroupData?.children || [], d => d.id)
        .join("a")
        .attr("href", d => d.url || "")
        .append("div")
        .attr("class", "grid-item")
        .each(function(itemData){
          const view = d3.select(this);
          if (itemData.icon) view.append("div").attr("class", "icon").html(icons[itemData.icon] || `<img src="${itemData.icon}"/>`);

          const text = view.append("div").attr("class", "text")
          if (itemData.heading) text.append("div").attr("class", "heading").attr("data-text", itemData.heading);
          if (itemData.caption) text.append("div").attr("class", "caption").attr("data-text", itemData.caption);
        });
    });





  const _this = this;
  function selectMenuItem(d) {
    _this.selectedMenuItem = d.menu_label === _this.selectedMenuItem ? null : d.menu_label;
    if (_this.selectedMenuItem) state.dispatch.call("menuOpen", null, d);
    placeHolder.selectAll(".nav-expandable-item a.menu-item")
      .classed("active", d => _this.selectedMenuItem === d?.menu_label);
  }

  state.dispatch.on("menuClose", () => {
    this.selectedMenuItem = null;
    selectMenuItem({});
    switchHowTo.call(this);
  });

  placeHolder.select(".howto-button")
    .on("click", () => toggleHowTo());

  mobileMenu.select(".howto-button")
    .on("click", () => toggleHowToMobile());

  placeHolder.select(".how-to-close")
    .on("click", () => toggleHowTo(false));

  howToOuter
    .on("click", () => toggleHowTo(false));

  const hamburgerButton = d3.select(menuButton)
    .on("click", () => toggleMobileMenu());


  translate();
  state.dispatch.on("translate.menu", () => {
    translate();
  });

  function translate() {
    placeHolder.selectAll(".heading").each(translateNode(translator));
    placeHolder.selectAll(".caption").each(translateNode(translator));
    mobileMenu.selectAll(".heading").each(translateNode(translator));
    mobileMenu.selectAll(".caption").each(translateNode(translator));
  }

  function toggleHowTo(force) {
    isHowToOpen = force ?? !isHowToOpen;
    howToOuter.style("display", isHowToOpen ? "block" : "none");
    const howToContent = placeHolder.select(".howToContent");

    if (isHowToOpen && !howToContent.select("iframe").size()) {
      if(theme.videoUrl) howToContent.html(getVideoIframeHTMLTemplate(videoSrc));
    }

  }

  function toggleHowToMobile(force) {
    const howToContentMobile = mobileMenu.select(".howToContentMobile");

    if (force !== false && !howToContentMobile.select("iframe").size()) {
      if(theme.videoUrl) howToContentMobile.html(getVideoIframeHTMLTemplate(videoSrc));
    }
  }

  function toggleMobileMenu(force) {
    isMobileMenuOpen = force ?? !isMobileMenuOpen;
    mobileMenu.classed("open", isMobileMenuOpen);
    hamburgerButton.classed("open", isMobileMenuOpen);
  }


  d3.select(window).on("resize.menu", () => {
    //skip menu resize in fullscreen
    if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement || document.mozFullScreenElement) return;
    //if (this.selectedMenuItem === "data_editor") return;

    this.selectedMenuItem = null;
    //selectMenuItem({});
    toggleHowTo(false);
    toggleMobileMenu(false);
    toggleHowToMobile(false);
  });


};

export default Menu;

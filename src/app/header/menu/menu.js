import * as utils from "../../core/utils";

const HOWTO_IFRAME = `<iframe
  width="100%"
  style="aspect-ratio: 16 / 9; border: 1px solid grey;"
  src="https://www.youtube.com/embed/lSYU5X3ETf8?si=LZpmhJMaMbdXLe5b&rel=0"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
  </iframe>`;

const Menu = function({ dom, translator, state, data, menuButton, mobileMenuContainer }) {
  const template = `
    <a class="howto-button" data-text="how_to_use"></a>

    <div class="how-to-outer">
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
  const placeHolder = d3.select(dom).html(template);
  const mobileMenu = d3.select(mobileMenuContainer);
  const howToOuter = placeHolder.select(".how-to-outer");
  const menuItems = data.children;
  let isHowToOpen = false;
  let isMobileMenuOpen = false;

  mobileMenu.append("div").html(`<a class="howto-button" data-text="how_to_use"></a>`);
  mobileMenu.append("div").attr("class", "howToContentMobile");


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
    placeHolder.selectAll("a").each(utils.translateNode(translator));
    mobileMenu.selectAll("a").each(utils.translateNode(translator));
  }

  function toggleHowTo(force) {
    isHowToOpen = force ?? !isHowToOpen;
    howToOuter.style("display", isHowToOpen ? "block" : "none");
    const howToContent = placeHolder.select(".howToContent");

    if (isHowToOpen && !howToContent.select("iframe").size()) {
      howToContent.html(HOWTO_IFRAME);
    }

  }

  function toggleHowToMobile(force) {
    const howToContentMobile = mobileMenu.select(".howToContentMobile");

    if (force !== false && !howToContentMobile.select("iframe").size()) {
      howToContentMobile.html(HOWTO_IFRAME);
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

  //if(!menuItems) return;
  return;

  const _this = this;
  const templateHtml = `
    <li class="nav-expandable menu-items">
      <div class="nav-expandable-item">

        <a class="menu-item nav-toggle-expanded"></a>

        <div class="nav-expanded">
          <div class="nav-expanded-columns nav-expanded-columns-2 nav-expanded-columns-icons">
            <div class="nav-expanded-columns-inner">
              <ul>
                <li class="expanded-column-item">
                  <a class="menu-item" href="">
                    <div class="column-item-icon">
                      <img>
                    </div>
                    <div class="column-item-info">
                      <div class="column-item-heading"></div>
                      <div class="column-item-description"></div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </li>

    <li class="nav-expandable">
      <div class="nav-expandable-item">

        <a class="menu-item data-editor-button how-to-use-video" style="padding: 13px 2px 12px 2px" data-text=""></a>

        <div class="nav-expanded">
          <div class="how-to-outer">
            <div class="data-editor">
              <span class="data-editor-close button-close">&times;</span>
              <div class="data-editor-instructions">
                Congrats! You've discovered the hidden button for editing data sources
                <br/>
                <a target="_blank" href="https://docs.google.com/document/d/1Ibcuzp5eaQQus515OROzkQxpcvFf3wDU03mFQmrtmV4/preview">How to show data from a generic google spreadsheet ⧉</a>
              </div>
              <div class="table"></div>
              <p class="data-editor-buttons nav-faq-help-links">
                <a class="add-row">+</a>
                <a class="de-reload">Discard changes</a>
                <a class="de-reset">Reset everything and reload</a>
                <a class="de-apply">Apply and reload</a>
              </p>
            </div>    
          </div>
        </div>
      </div>

    </li>
  `;
  //require("./menu.html");
  const path = "./assets";


  const itemTemplate = template.select(".menu-items .nav-expandable-item");

  this.selectedMenuItem = null;

  this.howToContent = template.select(".howToContent");
  this.howToMobileContent = template.select(".howToMobileContent");
  template.select(".how-to-button")
    .datum({ menu_label: "how_to_use" })
    .on("click", (event, d) => {
      selectMenuItem(d);
      switchHowTo.call(this);
    });
  template.select(".how-to-close").on("click", () => {
    this.selectedMenuItem = null;
    selectMenuItem({});
    switchHowTo.call(this);
  });

  template.select(".data-editor-button")
    .datum({ menu_label: "data_editor" })
    .on("click", (evemt, d) => {
      selectMenuItem(d);
      switchHowTo.call(this);
    });
  template.select(".data-editor-close").on("click", () => {
    this.selectedMenuItem = null;
    selectMenuItem({});
    switchHowTo.call(this);
  });

  state.dispatch.on("menuClose", () => {
    this.selectedMenuItem = null;
    selectMenuItem({});
    switchHowTo.call(this);
  });


  // function translate() {
  //   placeHolder
  //     .selectAll(".menu-items .nav-expandable-item")
  //     .call(selection => selection
  //       .select("a.menu-item")
  //       .text(d => translator(d.menu_label)))
  //     .selectAll(".expanded-column-item")
  //     .call(selection => {
  //       selection.select(".column-item-heading").text(d => translator(d.menu_label));
  //       selection.select(".column-item-description").text(d => translator(d.caption));
  //     });

  //   placeHolder.select(".menu-item.how-to-use-video")
  //     .each(utils.translateNode(translator));
  //   placeHolder.select(".menu-item.data-editor-button")
  //     .each(utils.translateNode(translator));
  //   placeHolder.selectAll("p.nav-faq-help-links a")
  //     .each(utils.translateNode(translator));
  // }


  function selectMenuItem(d) {
    _this.selectedMenuItem = d.menu_label === _this.selectedMenuItem ? null : d.menu_label;
    if (_this.selectedMenuItem) state.dispatch.call("menuOpen", null, d);
    placeHolder.selectAll(".nav-expandable-item a.menu-item")
      .classed("active", d => _this.selectedMenuItem === d?.menu_label);
  }

  function fillMenuItem(item) {
    const menuItem = item.datum();
    const a = item.select("a.menu-item");
    a.on("click", (event, d) => selectMenuItem(d));
    const itemTemplate = item.select(".expanded-column-item");
    for (const item of menuItem.children) {
      itemTemplate.clone(true)
        .datum(item)
        .raise()
        .call(fillColumnItem);
    }
    itemTemplate.remove();
  }

  function fillColumnItem(item) {
    const columnItem = item.datum();
    const a = item.select("a.menu-item");
    a.attr("href", columnItem.url);
    const img = a.select(".column-item-icon img");
    if (columnItem.icon_url) {
      img.attr("src", path + columnItem.icon_url);
    } else {
      img.remove();
    }
  }
};

export default Menu;

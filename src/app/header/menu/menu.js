import * as utils from "../../core/utils";

const Menu = function({ dom, translator, state, data }) {
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

        <a class="menu-item how-to-button how-to-use-video" data-text="how_to_use"><span>►</span>_</a>

        <div class="nav-expanded">
          <div class="how-to-outer">
            <div class="how-to-content">
              <span class="how-to-close button-close">&times;</span>
              <div class="howToContent"></div>
                <p class="nav-faq-help-links">
                  <a target="_blank" href="//static.gapminder.org/GapminderMedia/wp-uploads/Gapminder-Tools-Guide.pdf" data-text="pdf_guide"></a>
                  <a target="_blank" href="//www.gapminder.org/tools-offline/" data-text="can_i_download_Gapminder_Tools"></a>
                  <a target="_blank" href="//vizabi.org/tutorials/2017/04/03/show-your-data/" data-text="can_i_show_my_own_data"></a>
                  <a target="_blank" href="//www.gapminder.org/faq_frequently_asked_questions/" data-text="more_help_and_faq"></a>
                </p>
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

  const placeHolder = d3.select(dom);
  const menuItems = data.children;
  const template = d3.create("div");
  template.html(templateHtml);

  const itemTemplate = template.select(".menu-items .nav-expandable-item");
  for (const item of menuItems) {
    itemTemplate.clone(true)
      .datum(item)
      .raise()
      .call(fillMenuItem);
  }
  itemTemplate.remove();

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

  for (const elem of Array.from(template.node().children)) {
    placeHolder.append(() => elem);
  }

  translate();
  state.dispatch.on("translate.menu", () => {
    translate();
  });

  d3.select(window).on("resize.menu", () => {
    //skip menu resize in fullscreen
    if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement || document.mozFullScreenElement) return;
    if (this.selectedMenuItem === "data_editor") return;

    this.selectedMenuItem = null;
    selectMenuItem({});
    switchHowTo.call(this);
  });

  function translate() {
    placeHolder
      .selectAll(".menu-items .nav-expandable-item")
      .call(selection => selection
        .select("a.menu-item")
        .text(d => translator(d.menu_label)))
      .selectAll(".expanded-column-item")
      .call(selection => {
        selection.select(".column-item-heading").text(d => translator(d.menu_label));
        selection.select(".column-item-description").text(d => translator(d.caption));
      });

    placeHolder.select(".menu-item.how-to-use-video")
      .each(utils.translateNode(translator));
    placeHolder.select(".menu-item.data-editor-button")
      .each(utils.translateNode(translator));
    placeHolder.selectAll("p.nav-faq-help-links a")
      .each(utils.translateNode(translator));
  }

  function switchHowTo() {
    const howToContentEmpty = this.howToContent.node().children.length <= 0;

    if (howToContentEmpty) {
      const content = document.createElement("div");
      const contentMobile = document.createElement("div");
      const vimeoContent = `<iframe src="https://player.vimeo.com/video/231885967"
                                    class="how-to-frame"
                                    webkitallowfullscreen
                                    mozallowfullscreen
                                    allowfullscreen></iframe>`;

      content.innerHTML = vimeoContent;
      contentMobile.innerHTML = vimeoContent;
      this.howToContent.node().appendChild(content);
    }

  }

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

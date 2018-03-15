import * as utils from "../../core/utils";

const Menu = function (placeHolder, translator, dispatch, { menuItems }) {
  const templateHtml = require("./menu.html");
  const path = "./assets";

  const template = d3.create("div")
  template.html(templateHtml);

  const itemTemplate = template.select(".menu-items .nav-expandable-item");
  for (let item of menuItems) {
    itemTemplate.clone(true)
      .datum(item)
      .raise()
      .call(fillMenuItem)
  }
  itemTemplate.remove();

  this.isHowToVisible = false;
  this.howToContent = template.select(".howToContent");
  this.howToMobileContent = template.select(".howToMobileContent");
  template.select(".how-to-button").on("click", () => switchHowTo.call(this));
  template.select(".how-to-modal-close").on("click", () => switchHowTo.call(this));


  for (const elem of Array.from(template.node().children)) {
    placeHolder.append(function () { return elem; });
  }

  translate();
  dispatch.on("translate.menu", () => {
    translate();
  });

  function translate() {
    placeHolder
      .selectAll(".menu-items .nav-expandable-item")
      .call((selection) => selection
        .select("a.menu-item")
        .text((d) => translator(d.menu_label)))
      .selectAll(".expanded-column-item")
      .call((selection) => {
        selection.select(".column-item-heading").text((d) => translator(d.menu_label));
        selection.select(".column-item-description").text((d) => translator(d.caption));
      })

    placeHolder.select(".menu-item.how-to-use-video")
      .each(utils.translateNode(translator));
    placeHolder.selectAll("p.nav-faq-help-links a")
      .each(utils.translateNode(translator));
  }

  function switchHowTo() {
    this.isHowToVisible = !this.isHowToVisible;
    placeHolder.select(".how-to-modal.desktop").attr("hidden", this.isHowToVisible ? null : true);
    placeHolder.select(".how-to-content.mobile").attr("hidden", this.isHowToVisible ? null : true);

    const howToContentEmpty = this.howToContent.node().children.length <= 0;
    const howToMobileContentEmpty = this.howToMobileContent.node().children.length <= 0;

    if (this.isHowToVisible) {
      const content = document.createElement('div');
      const contentMobile = document.createElement('div');
      const vimeoContent = `<iframe src="https://player.vimeo.com/video/231885967"
                                    class="how-to-frame"
                                    webkitallowfullscreen
                                    mozallowfullscreen
                                    allowfullscreen></iframe>`;

      content.innerHTML = vimeoContent;
      contentMobile.innerHTML = vimeoContent;

      if (howToContentEmpty) {
        this.howToContent.node().appendChild(content);
      }

      if (howToMobileContentEmpty) {
        this.howToMobileContent.node().appendChild(contentMobile);
      }
    }
  }

  function fillMenuItem(item) {
    const menuItem = item.datum();
    const itemTemplate = item.select(".expanded-column-item");
    for (let item of menuItem.children) {
      itemTemplate.clone(true)
        .datum(item)
        .raise()
        .call(fillColumnItem)
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
}

export default Menu;
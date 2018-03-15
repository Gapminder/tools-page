import * as utils from "../core/utils";

const RelatedItems = function (placeHolder, translator, dispatch, { relatedItems }) {
  const templateHtml = require("./related-items.html");

  const template = d3.create("div")
  template.html(templateHtml);

  const itemTemplate = template.select(".related-item");
  for (let relatedItem of relatedItems) {
    itemTemplate.clone(true)
      .datum(relatedItem)
      .raise()
      .call(fillRelatedItem);
  }
  itemTemplate.remove();

  for (const elem of Array.from(template.node().children)) {
    placeHolder.append(function () { return elem; });
  }

  translate();
  dispatch.on("translate.relatedItems", () => {
    translate();
  });

  function translate() {
    placeHolder.select(".related-heading").each(utils.translateNode(translator));
    placeHolder.selectAll(".related-item .related-item-info .title").each(utils.translateNode(translator));
    placeHolder.selectAll(".related-item .related-item-info .subtitle").each(utils.translateNode(translator));
  }

  function fillRelatedItem(item) {
    const relatedItem = item.datum();
    const a = item.select("a");
    a.attr("href", relatedItem.link);
    a.select(".related-item-thumbnail img").attr("src", relatedItem.image);
    a.select(".related-item-info .title")
      .attr("data-text", 'related-' + relatedItem._id + '-title');
    a.select(".related-item-info .subtitle")
      .attr("data-text", 'related-' + relatedItem._id + '-subtitle');
  }

}

export default RelatedItems;
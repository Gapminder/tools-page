import * as utils from "../core/utils";

const RelatedItems = function(placeHolder, translator, dispatch, { relatedItems }) {
  const templateHtml = `  
    <div class="related-block">
      <h2 class="heading-2 related-heading" data-text="popular"></h2>

      <div class="related-container">
        <ul class="related-items">

          <li class="related-item">
            <a rel="noopener">
              <div class="related-item-thumbnail">
                <img>
              </div>
              <div class="related-item-info">
                <span class="title"></span>
                <span class="subtitle"></span>
              </div>
            </a>
          </li>

        </ul>
      </div>
    </div>
  `;
  //require("./related-items.html");

  const template = d3.create("div");
  template.html(templateHtml);

  const itemTemplate = template.select(".related-item");
  for (const relatedItem of relatedItems) {
    itemTemplate.clone(true)
      .datum(relatedItem)
      .raise()
      .call(fillRelatedItem);
  }
  itemTemplate.remove();

  for (const elem of Array.from(template.node().children)) {
    placeHolder.append(() => elem);
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
      .attr("data-text", "related-" + relatedItem._id + "-title");
    a.select(".related-item-info .subtitle")
      .attr("data-text", "related-" + relatedItem._id + "-subtitle");
  }

};

export default RelatedItems;

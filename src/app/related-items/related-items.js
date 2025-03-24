import * as utils from "../core/utils";

const RelatedItems = function({ dom, translator, state, data }) {
  const template = `  
    <div class="related-heading" data-text="popular"></div>
    <div class="related-container">
      <ul class="related-items"></ul>
    </div>
  `;

  const placeHolder = d3.select(dom).html(template);
  placeHolder.select("ul.related-items")
    .selectAll("li")
    .data(data)
    .join("li")
    .attr("class", "related-item")
    .html(d => `
      <a class="newtab" rel="noopener" href="${d.link}" target="_blank">
        <div class="related-item-thumbnail">
          <img src="${d.image}">
        </div>
        <div class="related-item-info">
          <span class="title" data-text="related-${d._id}-title" data-text-fallback="${d.title}"></span>
          <span class="subtitle" data-text="related-${d._id}-subtitle" data-text-fallback="${d.subtitle}"></span>
        </div>
      </a>`
    );

  translate();
  state.dispatch.on("translate.relatedItems", () => {
    translate();
  });

  function translate() {
    placeHolder.select(".related-heading").each(utils.translateNode(translator));
    placeHolder.selectAll(".related-item .related-item-info .title").each(utils.translateNode(translator));
    placeHolder.selectAll(".related-item .related-item-info .subtitle").each(utils.translateNode(translator));
  }

};

export default RelatedItems;

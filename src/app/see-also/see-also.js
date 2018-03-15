import * as utils from "../core/utils";

const SeeAlso = function (placeHolder, translator, dispatch, { tools, selectedTool, onClick }) {
  const templateHtml = require("./see-also.html");

  const template = d3.create("div")
  template.html(templateHtml);

  const itemTemplate = template.select(".other-tools-item");
  for (let tool of tools) {
    itemTemplate.clone(true)
      .datum(tool)
      .attr("hidden", tool.id === selectedTool ? true : null)
      .raise()
      .call(fillToolItem);
  }
  itemTemplate.remove();

  for (const elem of Array.from(template.node().children)) {
    placeHolder.append(function () { return elem; });
  }

  translate();
  dispatch.on("translate.seeAlso", () => {
    translate();
  });

  dispatch.on("toolChanged.seeAlso", d => {
    toolChanged(d);
  })

  function translate() {
    placeHolder.select(".see-also-heading").each(utils.translateNode(translator));
    placeHolder.selectAll(".other-tools-item").select(".title")
      .text(d => translator(d.title || d.id));
  }

  function toolChanged(tool) {
    placeHolder.selectAll(".other-tools-item")
    .attr("hidden", _d => _d.id === tool.id ? true : null)
  }

  function fillToolItem(item) {
    const tool = item.datum();
    const a = item.select("a");
    if (tool.url) {
      a.attr("href", tool.url)
    } else {
      a.on("click", d => {
        onClick(d);
      });
    }
    a.select(".image").attr("src", "." + tool.image);
  }

}

export default SeeAlso;
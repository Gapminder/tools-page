import * as utils from "../core/utils";

const SeeAlso = function(placeHolder, translator, dispatch, { tools, selectedTool, onClick }) {
  const templateHtml = `
    <div class="see-also-block">
      <h2 class="heading-2 see-also-heading" data-text="other_tools"></h2>

      <div class="other-tools-container">
        <div class="other-tools-item">
          <a rel="noopener">
            <img class="image"/>
            <span class="title"></span>
          </a>
        </div>
      </div>
    </div>
  `;
  //require("./see-also.html");

  //TODO why is it not passed via arguments?
  tools = toolsPage_toolset;

  const template = d3.create("div");
  template.html(templateHtml);

  const itemTemplate = template.select(".other-tools-item");
  for (const tool of tools) {
    itemTemplate.clone(true)
      .datum(tool)
      .attr("hidden", (tool.id === selectedTool || tool.hideThumbnail) ? true : null)
      .raise()
      .call(fillToolItem);
  }
  itemTemplate.remove();

  for (const elem of Array.from(template.node().children)) {
    placeHolder.append(() => elem);
  }

  translate();
  dispatch.on("translate.seeAlso", () => {
    translate();
  });

  dispatch.on("toolChanged.seeAlso", d => {
    const tool = tools.filter(({ id }) => id === d)[0];
    toolChanged(tool);
  });

  function translate() {
    placeHolder.select(".see-also-heading").each(utils.translateNode(translator));
    placeHolder.selectAll(".other-tools-item").select(".title")
      .text(d => translator(d.title || d.id));
  }

  function toolChanged(tool) {
    placeHolder.selectAll(".other-tools-item")
      .attr("hidden", _d => (_d.id === tool.id || _d.hideThumbnail) ? true : null);
  }

  function getLink(tool) {
    return `${window.location.pathname}#$chart-type=${tool}`;
  }

  function fillToolItem(item) {
    const tool = item.datum();
    const a = item.select("a");
    if (tool.url) {
      a.attr("href", tool.url);
    } else {
      a.attr("href", getLink(tool.id))
        .on("click", (event, d) => {
          onClick(d);
        });
    }
    a.select(".image").attr("src", "." + tool.image);
  }

};

export default SeeAlso;

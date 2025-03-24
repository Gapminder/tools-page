import * as utils from "../core/utils";

const SeeAlso = function({ dom, translator, state, data }) {
  const template = `
    <div class="see-also-block">
      <h2 class="heading-2 see-also-heading" data-text="other_tools"></h2>
      <div class="other-tools-container"></div>
    </div>
  `;

  const placeHolder = d3.select(dom).html(template);
  const items = placeHolder.select(".other-tools-container").selectAll(".other-tools-item")
    .data(data)
    .join("div")
    .attr("class", "other-tools-item")
    //href="${getLink(d.id)}"
    .html(d => `
      <a rel="noopener">
        <img class="image" src="${d.image}"/>
        <span class="title"></span>
      </a>
    `)
    .on("click", (event, d) => {
      utils.scrollTo({
        element: d3.select(".wrapper").node(),
        complete: () => {
          state.setTool(d.id);
        }
      });

    });

  translate();
  updateShowHide();

  state.dispatch.on("translate.seeAlso", () => {
    translate();
  });

  state.dispatch.on("toolChanged.seeAlso", ({id, previousToolId}) => {
    updateShowHide(id);
  });

  function translate() {
    placeHolder.select(".see-also-heading").each(utils.translateNode(translator));
    items.select(".title").text(d => translator(d.title || d.id));
  }

  function updateShowHide(id = state.getTool()) {
    items.attr("hidden", d => (d.id === id || d.hideThumbnail) ? true : null);
  }

};

export default SeeAlso;

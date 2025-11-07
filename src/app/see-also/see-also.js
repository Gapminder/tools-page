import * as utils from "../core/utils";

const SeeAlso = function({ dom, translator, state, data, getTheme }) {
  const template = ``;

  const CLASS = "SeeAlso";
  const theme = getTheme(CLASS) || {};
  const placeHolder = d3.select(dom);
  if(!placeHolder || placeHolder.empty()) return;   
  placeHolder.html(template);
  if(theme.style)
    Object.entries(theme.style).forEach( ([key, value]) => placeHolder.style(key, value) );
  
  const items = placeHolder.selectAll(".other-tools-item")
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
        element: d3.select(".too-wrapper").node(),
        complete: () => state.setTool(d.id)
      });

    });

  translate();
  updateShowHide();

  state.dispatch.on("translate.seeAlso", translate);
  
  state.dispatch.on("toolChanged.seeAlso", ({ id }) => {
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

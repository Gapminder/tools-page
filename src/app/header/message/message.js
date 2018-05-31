import * as utils from "../../core/utils";

const Message = function () {

  let placeHolder;

  function init(placeHolderArg, translator, dispatch) {
    placeHolder = placeHolderArg;
    const templateHtml = require("./message.html");

    const template = d3.create("div")
    template.html(templateHtml);
    template.select("#message-close")
      .on("click", closeMessage);

    for (const elem of Array.from(template.node().children)) {
      placeHolder.append(function() { return elem;});
    }

    translate();
    dispatch.on("translate.message", () => {
      translate();
    });
  }

  function translate() {
    // no translation yet, because message text (from world) requires template for hash variable
    //placeHolder.select(".share-text-box")
    //  .each(utils.translateNode(translator));
  }

  function closeMessage() {
    placeHolder.style("display","none");
  }

  function showMessage(string) {
    placeHolder.style("display","block")
    placeHolder.select('#message-text').html(string);
  }

  return {
    closeMessage,
    showMessage,
    init
  }
  
}

export default Message();
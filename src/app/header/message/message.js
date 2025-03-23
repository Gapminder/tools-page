const Message = function({ dom, translator, state }) {

  const placeHolder = d3.select(dom);

  const templateHtml = `
    <div id="message">
      <span id="message-text"></span>
      <a id="message-close">
        <svg style="height: 20px;" class="vzb-icon vzb-icon-pin" viewBox="-150 -250 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1149 414q0 26 -19 45l-181 181l181 181q19 19 19 45q0 27 -19 46l-90 90q-19 19 -46 19q-26 0 -45 -19l-181 -181l-181 181q-19 19 -45 19q-27 0 -46 -19l-90 -90q-19 -19 -19 -46q0 -26 19 -45l181 -181l-181 -181q-19 -19 -19 -45q0 -27 19 -46l90 -90q19 -19 46 -19 q26 0 45 19l181 181l181 -181q19 -19 45 -19q27 0 46 19l90 90q19 19 19 46z"/></svg>
      </a>
    </div>
  `;
  //require("./message.html");

  const template = d3.create("div");
  template.html(templateHtml);
  template.select("#message-close")
    .on("click", closeMessage);

  for (const elem of Array.from(template.node().children)) {
    placeHolder.append(() => elem);
  }

  translate();
  state.dispatch.on("translate.message", () => {
    translate();
  });


  function translate() {
    // no translation yet, because message text (from world) requires template for hash variable
    //placeHolder.select(".share-text-box")
    //  .each(utils.translateNode(translator));
  }

  function closeMessage() {
    placeHolder.style("display", "none");
  }

  function showMessage(string) {
    placeHolder.style("display", "block");
    placeHolder.select("#message-text").html(string);
  }


};

export default Message;

const Message = function({ dom, translator, state }) {

  const placeHolder = d3.select(dom);

  const templateHtml = `
    <div class="message">
      <span class="message-text"></span>
      <a class="close">✕</a>
    </div>
  `;
  //require("./message.html");

  const template = d3.create("div");
  template.html(templateHtml);
  template.select(".close")
    .on("click", closeMessage);

  for (const elem of Array.from(template.node().children)) {
    placeHolder.append(() => elem);
  }

  translate();
  state.dispatch.on("translate.message", translate);


  function translate() {
  }

  function closeMessage() {
    placeHolder.style("display", "none");
  }

  function showMessage(string) {
    placeHolder.style("display", "block");
    placeHolder.select(".message-text").html(string);
  }

  return { showMessage, closeMessage };
};

export default Message;

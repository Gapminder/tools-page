(function () {
  if (window.top === window.self) return;
  if (window.__embeddedBridgeInitialized) return;
  window.__embeddedBridgeInitialized = true;

  let parentOrigin = "*";
  let lastConfig = null;
  let lastMeta = {};

  const emit = (name, detail) => {
    console.log("emit", name, detail);
    window.dispatchEvent(new CustomEvent(name, { detail }));
  };

  const postToParent = (msg) => {
    window.parent.postMessage(msg, parentOrigin);
  };

  const bridge = {
    requestConfig(options) {
      postToParent({ type: "request-config", ...options });
    },
    setRightConfig(config) {
      postToParent({ type: "set-right-config", config });
    },
    getLastConfig() {
      return lastConfig;
    },
    getMeta() {
      return lastMeta;
    }
  };

  window.embeddedBridge = bridge;

  const handler = (event) => {
    parentOrigin = event.origin || parentOrigin;

    const msg = event.data || {};
    if (!msg || !msg.type) return;

    switch (msg.type) {
      case "response-config":
        lastMeta = { toolId: msg.toolId, pageId: msg.pageId, origin: event.origin };
        lastConfig = msg.config || null;
        emit("embedded:response-config", { meta: lastMeta, config: lastConfig, skipSetTool: msg.skipSetTool });
        break;

      case "ack-set-right-config":
        emit("embedded:ack-set-right-config", {});
        break;

      default:
        emit("embedded:message", msg);
        break;
    }
  };

  window.addEventListener("message", handler, false);

  if (window.top !== window.self) {
    postToParent({ type: "iframe-ready" });
  }
})();
import { upgradeUrl } from "./deprecated-url";

import {
  debounce,
  deepExtend,
} from "./utils";
import { runInAction } from "mobx";

const URL_VERSION = "v2";

let poppedModel = {};
let URLI = {};

let popStateLoopFlag = false;
const resetPopStateLoopFlag = debounce(() => {
  popStateLoopFlag = false;
}, 500);

window.addEventListener("popstate", e => {
  //console.log(e, diffObject());
  if (!e.state) {
    parseURL();
    window.history.replaceState({
      tool: URLI["chart-type"],
      model: deepExtend({}, URLI.model, true)
    }, "Title");
    poppedModel = {};
    return;
  }

  //console.log("model diff", diffObject(e.state.model, viz.getModel()));
  poppedModel = e.state.model;
  if (e.state.tool !== appState.tool) {
    parseURL();
    setTool(e.state.tool, true);
    dispatch.call("toolChanged", null, e.state.tool);
  } else {
    //FIX ME
    //We have problem with possible infinite loop of
    //updating vizabi model - updating url - updating vizabi model and so on…
    //because hook.spaceRef is not model prop from init
    popStateLoopFlag = true;
    //viz.setModel(poppedModel);
    runInAction(() => {
      VizabiSharedComponents.Utils.replaceProps(VIZABI_UI_CONFIG, e.state.model.ui || {});
      VizabiSharedComponents.Utils.mergeInTarget(viz.model.config, e.state.model.model || {});
    });
  }

  const localeId = ((poppedModel || {}).locale || {}).id;
  if (localeId && localeId !== appState.language) {
    dispatch.call("languageChanged", null, localeId);
  }

  const projector = (poppedModel || {}).projector;
  if (projector && projector !== appState.projector) {
    dispatch.call("projectorChanged", null, projector);
  }
});

//grabs width, height, tabs open, and updates the url
function updateURL(model, tool, replaceInsteadPush) {
  resetPopStateLoopFlag();
  // if (popStateLoopFlag || (poppedModel && comparePlainObjects(viz.getModel(), poppedModel))) {
  //   //popStateLoopFlag = false;
  //   return;
  // }

  // poppedModel = viz.getModel();
  poppedModel = model;

  // if (typeof viz !== "undefined") {
  //   minModel = viz.getPersistentMinimalModel(VIZABI_PAGE_MODEL);
  // }

  const url = {};
  if (poppedModel.ui && Object.keys(poppedModel.ui).length > 0) {
    Object.assign(url, { ui: poppedModel.ui });
  }
  if (poppedModel.model && Object.keys(poppedModel.model).length > 0) {
    Object.assign(url, { model: poppedModel.model });
  }
  // if (minModel && Object.keys(minModel).length > 0) {
  //   Object.assign(url, minModel);
  // }
  url["chart-type"] = tool;
  url["url"] = URL_VERSION;

  //console.log("pushing state", poppedModel, event);
  window.history[replaceInsteadPush ? "replaceState" : "pushState"]({
    tool: url["chart-type"],
    model: deepExtend({}, poppedModel, true)
  //need to encode symbols like # in color codes because urlon can't handle them properly
  }, "Title", "#" + encodeUrlHash(urlon.stringify(url)));
}

const debouncedUpdateUrl = debounce(updateURL, 310);

function parseURL(rawUrl = window.location.toString()) {
  const hash = rawUrl.includes("#") && rawUrl.substring(rawUrl.indexOf("#") + 1);
  if (!hash) return null;

  let parsedUrl = {};
  try {
    parsedUrl = urlon.parse(decodeUrlHash(hash) || "$;");
  }
  catch {
    console.warn("Failed to decode and parse this hash:", hash);
  }

  return parsedUrl;
}

function encodeUrlHash(hash) {
  return hash.replace(/=#/g, "=%23");
}

function decodeUrlHash(hash) {
  //replacing %2523 with %23 needed when manual encoding operation of encodeUrlHash()
  //plus the enforced encoding in some browsers resulted in double encoding
  return decodeURIComponent(hash.replace(/%2523/g, "%23"));
}

function resetURL() {
  //var href = location.href + "#";

  window.history.replaceState("Object", "Title", "#");
  //location.href = href.substring(0, href.indexOf('#'));
}


function getEmbedded() {
  const embeddedMatch = /embedded=(true|false)/.exec(window.location.search);
  return (embeddedMatch || [])[1] === "true";
}
function getLocale() {
  return URLI.model?.ui?.locale;
}
function getProjector() {
  return URLI.model?.ui?.projector === "true";
}

function init({ allowedTools }) {

  //Upgrade raw URL
  const url = location.href;
  const upgradedUrl = upgradeUrl(url);
  if (upgradedUrl !== url)
    location.replace(upgradedUrl);

  //Only then parse URL
  const model = parseURL();
  URLI = model;

  //apply defaults
  const toolFromUrl = URLI["chart-type"];
  const tool = (toolFromUrl && allowedTools.includes(toolFromUrl)) ? toolFromUrl : allowedTools[0];

  updateURL(model, tool, true);


  return tool;
}

export {
  init,
  URLI,
  debouncedUpdateUrl as updateURL,
  encodeUrlHash,
  decodeUrlHash,
  parseURL,
  resetURL,
  getEmbedded, getLocale, getProjector
};

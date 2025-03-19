import { upgradeUrl } from "./deprecated-url.js";
import { debounce, deepExtend } from "./utils.js";

const URL_VERSION = "v2";
const dispatch = d3.dispatch("translate", "toolChanged", "toolStateChangeFromPage", "toolReset", "languageChanged", "projectorChanged", "menuOpen", "menuClose");


//TODO: We have problem with possible infinite loop of
//updating vizabi model - updating url - updating vizabi model and so on…
let popStateLoopFlag = false;
const resetPopStateLoopFlag = debounce(() => {popStateLoopFlag = false;}, 500);

let URLI = {ui: {}, model: {}};
let defaultLocale = null;

function init({ allowedTools, defaultLocale }) {
  //Upgrade raw URL
  const url = location.href;
  const upgradedUrl = upgradeUrl(url);
  if (upgradedUrl !== url)
    location.replace(upgradedUrl);

  //Only then parse URL
  URLI = deepExtend({ui: {locale: defaultLocale}}, parseURLHashWithUrlon());

  //apply defaults
  const toolFromUrl = getTool();
  const tool = (toolFromUrl && allowedTools.includes(toolFromUrl)) ? toolFromUrl : allowedTools[0];

  updateURL({model: URLI.model, ui: URLI.ui, tool, replaceInsteadPush: true});
  return {getEmbedded, getTool, getURLI, getLocale, getProjector, setTool, setLocale, setProjector, updateURL, dispatch};
}


function popState(state){
  
  //if history state is empty — backfill it based on URL hash
  if (!state) {
    URLI = parseURLHashWithUrlon();
    return pushToHistory({model: URLI.model, ui: URLI.ui, replaceInsteadPush: true});
  }

  const tool = state.tool;
  if (tool && tool !== getTool()) {
    setTool(tool);
  } else {
    popStateLoopFlag = true;
    dispatch.call("toolStateChangeFromPage", null, state);
  }

  setLocale(state.ui?.locale);
  setProjector(state.ui?.projector);
};

function updateURL({model = {}, ui = {}, tool, replaceInsteadPush}) {
  Object.assign(URLI, {model, ui, "chart-type": tool});
  resetPopStateLoopFlag();
  pushToHistory({tool, ui, model, replaceInsteadPush})
}

function resetURL() {
  pushToHistory();
}

function pushToHistory({tool = URLI["chart-type"], ui = URLI.ui, model = URLI.model, replaceInsteadPush = false} = {}) {
  
  const objectToSerialise = {};
  if (ui && Object.keys(ui).length > 0)
    Object.assign(objectToSerialise, { ui: ui });
  if (model && Object.keys(model).length > 0)
    Object.assign(objectToSerialise, { model: model });

  objectToSerialise["chart-type"] = tool;
  objectToSerialise["url"] = URL_VERSION;

  window.history[replaceInsteadPush ? "replaceState" : "pushState"]({
    tool,
    model: deepExtend({}, model, true),
    ui: deepExtend({}, model, true),
  //need to encode symbols like # in color codes because urlon can't handle them properly
  }, "unused mandatory parameter", "#" + encodeUrlHash(urlon.stringify(objectToSerialise)));
}

function getURLI(){
  return URLI;
}
function getEmbedded() {
  return window.location.search.includes("embedded=true");
}
function getLocale() {
  return URLI.ui?.locale;
}
function getProjector() {
  return URLI.ui?.projector === "true";
}
function getTool() {
  return URLI["chart-type"];
}
function setLocale(id) {
  if(!id || id === getLocale()) return;
  Object.assign(URLI.ui, {locale: id});
  pushToHistory();
  dispatch.call("languageChanged", null, id);
}
function setProjector(truefalse) {
  if(!truefalse && truefalse !== false || truefalse === getProjector()) return;
  Object.assign(URLI.ui, {projector: truefalse});
  pushToHistory();
  dispatch.call("projectorChanged", null, truefalse);
}
function setTool(id, force = false) {
  if(id === getTool() && force) {
    resetURL();
    dispatch.call("toolReset", null, id);
  } else if (id) {
    URLI["chart-type"] = id;
    pushToHistory();
    dispatch.call("toolChanged", null, id);
  }
}


function parseURLHashWithUrlon(rawUrl = window.location.toString()) {
  const hash = rawUrl.includes("#") && rawUrl.substring(rawUrl.indexOf("#") + 1);
  if (!hash) return {};

  try {
    return urlon.parse(decodeUrlHash(hash) || "$;");
  }
  catch {
    console.warn("Failed to decode and parse this URL hash:", hash);
    return {};
  }
}

//need to encode symbols like # in color codes because urlon can't handle them properly
function encodeUrlHash(hash) {
  return hash.replace(/=#/g, "=%23"); //replace every # with %23
}

function decodeUrlHash(hash) {
  //replacing %2523 with %23 needed when manual encoding operation of encodeUrlHash()
  //plus the enforced encoding in some browsers resulted in double encoding # --> %23 --> %2523
  return decodeURIComponent(hash.replace(/%2523/g, "%23"));
}

const debouncedUpdateUrl = debounce(updateURL, 310);

// HANDLE BROWSER BACK-FORWARD BUTTON
window.addEventListener("popstate", event => popState(event.state));

export {
  init,
  URLI,
  debouncedUpdateUrl as updateURL,
  encodeUrlHash,
  decodeUrlHash,
  parseURLHashWithUrlon,
  pushToHistory,
  resetURL,
  getURLI,
  getEmbedded, getLocale, getProjector, getTool,
  setLocale, setProjector, setTool,
  dispatch
};

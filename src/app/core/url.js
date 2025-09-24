import { upgradeUrl } from "./deprecated-url.js";
import { debounce, deepExtend } from "./utils.js";
import { encodeUrlHash, parseURLHashWithUrlon } from "../core/utils.js";

const URL_VERSION = "v2";
const dispatch = d3.dispatch("translate", "toolChanged", "toolStateChangeFromPage", "toolReset", "languageChanged", "projectorChanged", "menuOpen", "menuClose", "authStateChange", "showMessage");


//TODO: We have problem with possible infinite loop of
//updating vizabi model - updating url - updating vizabi model and so on…
let popStateLoopFlag = false;
const resetPopStateLoopFlag = debounce(() => { popStateLoopFlag = false; }, 500);

let URLI = { ui: {}, model: {} };
let authToken = null;
let defaultLoc = null;

function init({ allowedTools, defaultLocale }) {
  //Upgrade raw URL
  const url = location.href;
  const upgradedUrl = upgradeUrl(url);
  if (upgradedUrl !== url)
    location.replace(upgradedUrl);

  //Only then parse URL
  defaultLoc = defaultLocale;
  URLI = deepExtend({ ui: { locale: { id: defaultLocale } } }, parseURLHashWithUrlon());

  //apply defaults
  const toolFromUrl = getTool();
  const tool = (toolFromUrl && allowedTools.includes(toolFromUrl)) ? toolFromUrl : allowedTools[0];

  updateURL({ model: URLI.model, ui: URLI.ui, tool, replaceInsteadPush: true });
  return { getEmbedded, getTool, resetState, getURLI, getLocale, getProjector, setTool, setLocale, setAuthToken, getAuthToken, setProjector, updateURL: debouncedUpdateUrl, dispatch };
}


function popState(state) {

  //if history state is empty — backfill it based on URL hash
  if (!state) {
    URLI = deepExtend({ ui: { locale: { id: defaultLoc } } }, parseURLHashWithUrlon());
    return pushToHistory({ model: URLI.model, ui: URLI.ui, replaceInsteadPush: true });
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
}

function updateURL({ model = {}, ui = {}, tool, replaceInsteadPush }) {
  Object.assign(URLI, { model, ui, "chart-type": tool });
  resetPopStateLoopFlag();
  pushToHistory({ tool, ui, model, replaceInsteadPush });
}

function pushToHistory({ tool = URLI["chart-type"], ui = URLI.ui, model = URLI.model, replaceInsteadPush = false } = {}) {

  const objectToSerialise = {};
  if (ui && Object.keys(ui).length > 0)
    Object.assign(objectToSerialise, { ui });
  if (model && Object.keys(model).length > 0)
    Object.assign(objectToSerialise, { model });

  objectToSerialise["chart-type"] = tool;
  objectToSerialise["url"] = URL_VERSION;

  window.history[replaceInsteadPush ? "replaceState" : "pushState"]({
    tool,
    model: deepExtend({}, model, true),
    ui: deepExtend({}, model, true),
  //need to encode symbols like # in color codes because urlon can't handle them properly
  }, "unused mandatory parameter", "#" + encodeUrlHash(urlon.stringify(objectToSerialise)));
}

function getAuthToken() {
  return authToken;
}
function getURLI() {
  return URLI;
}
function getEmbedded() {
  return window.location.search.includes("embedded=true");
}
function getLocale() {
  return URLI.ui?.locale?.id;
}
function getProjector() {
  return URLI.ui?.projector === "true";
}
function getTool() {
  return URLI["chart-type"];
}
function setAuthToken({event, session}) {
  authToken = session?.access_token;
  dispatch.call("authStateChange", null, event);
}
function setLocale(id) {
  if (!id || id === getLocale()) return;
  Object.assign(URLI.ui, { locale: { id } });
  pushToHistory();
  dispatch.call("languageChanged", null, id);
}
function setProjector(truefalse) {
  if (!truefalse && truefalse !== false || truefalse === getProjector()) return;
  Object.assign(URLI.ui, { projector: truefalse });
  pushToHistory();
  dispatch.call("projectorChanged", null, truefalse);
}
function setTool(id = getTool()) {
  const previousToolId = URLI["chart-type"];
  URLI["chart-type"] = id;
  URLI.ui = { ui: { locale: { id: defaultLoc } } };
  URLI.model = {};
  pushToHistory();
  dispatch.call("toolChanged", null, { id, previousToolId });
}
function resetState() {
  URLI.ui = { ui: { locale: { id: defaultLoc } } };
  URLI.model = {};
  pushToHistory();
  dispatch.call("toolChanged", null, { id: getTool(), previousToolId: getTool() });
}

const debouncedUpdateUrl = debounce(updateURL, 310);

// HANDLE BROWSER BACK-FORWARD BUTTON
window.addEventListener("popstate", event => popState(event.state));

export {
  init,
  URLI,
  debouncedUpdateUrl as updateURL,
  pushToHistory,
  resetState,
  getURLI,
  getEmbedded, getLocale, getProjector, getTool, getAuthToken,
  setLocale, setProjector, setTool, setAuthToken,
  dispatch
};

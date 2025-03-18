const appState = {};
const dispatch = d3.dispatch("translate", "toolChanged", "languageChanged", "menuOpen", "menuClose");

function initState({ tool, defaultLocale, urlService }) {
  const locale = urlService.getLocale() || defaultLocale || "en";
  const projector = urlService.getProjector() || false;
  const embedded = urlService.getEmbedded();
  Object.assign(appState, { tool, locale, projector, embedded });
  return {getState, setState, dispatch};
}
function setState(key, value) {
  Object.assign(appState, { [key]: value });
  return appState;
}
function getState(key) {
  return key ? appState[key] : appState;
}

export { initState, setState, getState, dispatch };

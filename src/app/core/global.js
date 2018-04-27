var appState = {};
const dispatch = d3.dispatch("translate", "toolChanged", "languageChanged");

export {
  appState,
  dispatch
};
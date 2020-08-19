const appState = {};
const dispatch = d3.dispatch("translate", "toolChanged", "languageChanged", "menuOpen", "menuClose");

export {
  appState,
  dispatch
};

import urlonUmd from "urlon/dist/urlon.umd";

const rule = {
  test(url) {
    //url contains hash, but doesn't contain version code
    return /#/.test(url) && !/url=v/.test(url);
  },

  use(url) {
    const hashIndex = url.indexOf("#") + 1;
    const hashPrefix = url.substr(0, hashIndex);
    const hash = url.substr(hashIndex);

    const state_v0 = urlon.parse(hash);


    //TODO: we might not need custom markers and use a common name for all
    function customMarkers(markers, chartType) {
      switch (chartType) {
        case "bubbles":
          markers["bubble"] = { modelType: "bubble", encoding: {} };
          return markers.bubble;
        case "linechart":
          markers["line"] = { encoding: {} };
          return markers.line;
        default: return {};
      }
    }

    const state_v1 = {};
    state_v1.url = "v1";
    if (state_v0["chart-type"]) {
      state_v1["chart-type"] = state_v0["chart-type"];
      if (state_v0.state) {
        state_v1.model = { markers: {} };
        const mainMarker = customMarkers(state_v1.model.markers, state_v0["chart-type"]);
        if (state_v0.state.time) {
          mainMarker.encoding.frame = {};
          if (state_v0.state.time.value) mainMarker.encoding.frame.value = state_v0.state.time.value;
        }
      }
      if (state_v0.ui) {

      }
    }

    return hashPrefix + urlon.stringify(state_v1);
  }
};

export default rule;

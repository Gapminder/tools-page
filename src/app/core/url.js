//ADAPTED CODE FROM: http://blog.vjeux.com/2011/javascript/urlon-url-object-notation.html
import {
  viz,
  setTool
} from "./tool";
import {
  setLanguage
} from "./language";
import {
  appState,
  dispatch
} from "./global";

var poppedModel = {};
var URLI = {};
var minModel;

window.addEventListener('popstate', function(e) {
  console.log(e, Vizabi.utils.diffObject());
  if (e.state) {
    console.log("model diff", Vizabi.utils.diffObject(e.state.model, viz.getModel()));
    poppedModel = e.state.model;
    if (e.state.tool !== appState.tool) {
      VIZABI_PAGE_MODEL = e.state.pageModel;
      VIZABI_MODEL = poppedModel;
      setTool(e.state.tool, true);
      dispatch.call("toolChanged", null, e.state.tool);
    } else {
      viz.setModel(poppedModel);
    }
    if (e.state.model.locale.id !== appState.language) {
      setLanguage(poppedModel.locale.id);
      dispatch.call("languageChanged", null, poppedModel.locale.id);
    }
  } else {
      poppedModel = {};
  }
});

//grabs width, height, tabs open, and updates the url
function updateURL(event) {
  if (poppedModel && Vizabi.utils.comparePlainObjects(viz.getModel(), poppedModel)) return;
  
  poppedModel = viz.getModel();

  var model;
  if(typeof viz !== 'undefined') {
    minModel = viz.getPersistentMinimalModel(VIZABI_PAGE_MODEL);
  }

  var url = {};
  if(minModel && Object.keys(minModel).length > 0) {
    Object.assign(url, minModel);
  }
  url["chart-type"] = appState.tool;

  console.log('pushing state', poppedModel, event);
  window.history.pushState({ tool: url["chart-type"], model: poppedModel, pageModel: Vizabi.utils.deepExtend({}, VIZABI_PAGE_MODEL) }, 'Title', "#" + urlon.stringify(url));
}

function parseURL() {
  var loc = window.location.toString();
  var hash = null;
  URLI = {
  };
  if(loc.indexOf('#') >= 0) {
    hash = loc.substring(loc.indexOf('#') + 1);

    if(hash) {
      var parsedUrl = urlon.parse(hash);

      URLI.model = parsedUrl || {};
      URLI["chart-type"] = parsedUrl["chart-type"];
      delete parsedUrl["chart-type"];
      return;
    }
  }
}

function resetURL() {
  //var href = location.href + "#";

  window.history.replaceState('Object', 'Title', "#");
  //location.href = href.substring(0, href.indexOf('#'));
}

export {
  URLI,
  updateURL,
  parseURL,
  resetURL
};
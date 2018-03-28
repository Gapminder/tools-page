//ADAPTED CODE FROM: http://blog.vjeux.com/2011/javascript/urlon-url-object-notation.html
import {
  viz,
  VIZABI_PAGE_MODEL
} from "./tool";
import {
  appState
} from "./global";

var poppedState;
var URLI = {};
var minModel;

window.addEventListener('popstate', function(e) {
  console.log(e, Vizabi.utils.diffObject());
  if (e.state) {
      console.log("model diff", Vizabi.utils.diffObject(e.state.model, viz.getModel()));
      poppedState = e.state.model;
      viz.setModel(e.state.model);
  } else {
      poppedState = null;
  }
});

//grabs width, height, tabs open, and updates the url
function updateURL(event) {
  if (poppedState && Vizabi.utils.comparePlainObjects(viz.getModel(), poppedState)) return;

  var model;
  if(typeof viz !== 'undefined') {
    minModel = viz.getPersistentMinimalModel(VIZABI_PAGE_MODEL);
  }

  var url = {
    "chart-type": appState.tool
  };

  if(minModel && Object.keys(minModel).length > 0) {
    url.model = minModel;
  }
  console.log('pushing state', viz.getModel(), event)
  window.history.pushState({ tool: url["chart-type"], model: viz.getModel() }, 'Title', "#" + urlon.stringify(url));
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

      URLI = parsedUrl || {};
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
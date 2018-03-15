//ADAPTED CODE FROM: http://blog.vjeux.com/2011/javascript/urlon-url-object-notation.html

var URLON={stringify:function(a){function b(a){return encodeURI(a.replace(/([=:&@_;\/])/g,"/$1"))}function c(a){if("number"==typeof a||a===!0||a===!1||null===a)return":"+a;if(a instanceof Array){for(var d=[],e=0;e<a.length;++e)d.push(c(a[e]));return"@"+d.join("&")+";"}if("object"==typeof a){var d=[];for(var f in a)d.push(b(f)+c(a[f]));return"_"+d.join("&")+";"}return"="+b((null!==a?void 0!==a?a:"undefined":"null").toString())}return c(a).replace(/;+$/g,"")},parse:function(a){function c(){for(var c="";b!==a.length;++b){if("/"===a.charAt(b)){if(b+=1,b===a.length){c+=";";break}}else if(a.charAt(b).match(/[=:&@_;]/))break;c+=a.charAt(b)}return c}function d(){var e=a.charAt(b++);if("="===e)return c();if(":"===e){var f=c();return"true"===f?!0:"false"===f?!1:(f=parseFloat(f),isNaN(f)?null:f)}if("@"===e){var g=[];a:if(!(b>=a.length||";"===a.charAt(b)))for(;;){if(g.push(d()),b>=a.length||";"===a.charAt(b))break a;b+=1}return b+=1,g}if("_"===e){var g={};a:if(!(b>=a.length||";"===a.charAt(b)))for(;;){var h=c();if(g[h]=d(),b>=a.length||";"===a.charAt(b))break a;b+=1}return b+=1,g}throw"Unexpected char "+e}var b=0;return a=decodeURI(a),d()}};
var URLI = {};

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
  window.history.pushState({ tool: url["chart-type"], model: viz.getModel() }, 'Title', "#" + URLON.stringify(url));
}

function parseURL() {
  var loc = window.location.toString();
  var hash = null;
  URLI = {
  };
  if(loc.indexOf('#') >= 0) {
    hash = loc.substring(loc.indexOf('#') + 1);

    if(hash) {
      parsedUrl = URLON.parse(hash);

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

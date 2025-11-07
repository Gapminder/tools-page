/* eslint no-prototype-builtins: "off" */

export function parseURLHashWithUrlon(rawUrl = window.location.toString()) {
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
export function encodeUrlHash(hash) {
  return hash.replace(/=#/g, "=%23"); //replace every # with %23
}

export function decodeUrlHash(hash) {
  //replacing %2523 with %23 needed when manual encoding operation of encodeUrlHash()
  //plus the enforced encoding in some browsers resulted in double encoding # --> %23 --> %2523
  return decodeURIComponent(hash.replace(/%2523/g, "%23"));
}

export function scrollTo({ durationLeft = 200, element, complete }) {
  if(!element) return;
  const positionFrom = element.scrollTop;
  const positionTo = 0 - positionFrom;

  if (positionTo < 0) {
    const positionDiff = positionTo / durationLeft * 10;
    element.scrollTop += positionDiff;
    setTimeout(() => {
      scrollTo({ durationLeft: durationLeft - 25, element, complete });
    }, 25);
  } else {
    complete();
  }
}

export function translateNode(translator) {
  return function() {
    const el = d3.select(this);
    const text = el.attr("data-text");
    const fallback = el.attr("data-text-fallback");
    if (!text) return;

    function applyContent({element, content}){
      if(content[0] === "<")
        element.html(content);
      else
        element.text(content);
    }

    const textChildNode = Array.from(el.node().childNodes)
      .filter(({ nodeName }) => nodeName === "#text")[0];

    applyContent( {
      element: textChildNode ? d3.select(textChildNode) : el, 
      content: translator(text) ?? fallback ?? text
    })
  };
}


export async function loadConfigModule(path) {
  const url = new URL(path, import.meta.url);
  const mod = await import(url.href);
  return mod.VIZABI_MODEL;
}


// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}


/**
 * Extening object that entered in first argument.
 *
 * Returns extended object or false if have no target object or incorrect type.
 *
 * If you wish to clone source object (without modify it), just use empty new
 * object as first argument, like this:
 *   deepExtend({}, yourObj_1, [yourObj_N]);
 */
export function deepExtend(/*obj_1, [obj_2], [obj_N]*/) {
  if (arguments.length < 1 || typeof arguments[0] !== "object") {
    return false;
  }

  if (arguments.length < 2) {
    return arguments[0];
  }

  const target = arguments[0];

  const lastArgIsBool = typeof arguments[arguments.length - 1] === "boolean";
  const overwriteByEmpty = lastArgIsBool && arguments[arguments.length - 1];
  // convert arguments to array and cut off target object
  const args = Array.prototype.slice.call(arguments, 1, (lastArgIsBool ? -1 : arguments.length));

  let val, src;

  forEach(args, obj => {
    // skip argument if it is array or isn't object
    if (typeof obj !== "object" || isArray(obj)) {
      return;
    }

    forEach(Object.keys(obj), key => {
      src = target[key]; // source value
      val = obj[key]; // new value

      // recursion prevention
      if (val === target) {
        /*
         * if new value isn't object then just overwrite by new value
         * instead of extending.
         * 2016-11-07 / Jasper: Added specific check for val instanceof Model for merging defaults & values of ComponentModels
         * 2016-11-07 / Jasper: Hack because importing Model doesn't work: instead check for val._data
         */
      } else if (typeof val !== "object" || val === null || val._data) {
        target[key] = val;

        // just clone arrays (and recursive clone objects inside)
      } else if (isArray(val)) {
        target[key] = deepCloneArray(val);

        // custom cloning and overwrite for specific objects
      } else if (isSpecificValue(val)) {
        target[key] = cloneSpecificValue(val);

        // overwrite by new value if source isn't object or array
      } else if (typeof src !== "object" || src === null || isArray(src)) {
        target[key] = deepExtend({}, val);

        // new value is empty object
      } else if (overwriteByEmpty && isEmpty(val)) {
        target[key] = {};

        // source value and new value is objects both, extending...
      } else {
        target[key] = deepExtend(src, val, overwriteByEmpty);
      }
    });
  });

  return target;
}

export function d3json(path, callback) {
  d3.json(path)
    .then(response => callback(null, response))
    .catch(error => callback(error));
}

/**
 * Object Comparison
 *
 * http://stamat.wordpress.com/2013/06/22/javascript-object-comparison/
 *
 * No version
 *
 * @param a
 * @param b
 * @returns {boolean} if objects are equal
 */
export function comparePlainObjects(a, b) {


  //Returns the object's class, Array, Date, RegExp, Object are of interest to us
  const getClass = function(val) {
    return Object.prototype.toString.call(val)
      .match(/^\[object\s(.*)\]$/)[1];
  };

  //Defines the type of the value, extended typeof
  const whatis = function(val) {

    if (val === undefined) {
      return "undefined";
    }
    if (val === null) {
      return "null";
    }

    let type = typeof val;

    if (type === "object") {
      type = getClass(val).toLowerCase();
    }

    if (type === "number") {
      return val.toString().indexOf(".") > 0 ?
        "float" :
        "integer";
    }

    return type;
  };

  const compare = function(a, b) {
    if (a === b) {
      return true;
    }
    for (const i in a) {
      if (b.hasOwnProperty(i)) {
        if (!equal(a[i], b[i])) {
          return false;
        }
      } else {
        return false;
      }
    }

    for (const i in b) {
      if (!a.hasOwnProperty(i)) {
        return false;
      }
    }
    return true;
  };

  const compareArrays = function(a, b) {
    if (a === b) {
      return true;
    }
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!equal(a[i], b[i])) {
        return false;
      }
    }
    return true;
  };

  const _equal = {};
  _equal.array = compareArrays;
  _equal.object = compare;
  _equal.date = function(a, b) {
    return a.getTime() === b.getTime();
  };
  _equal.regexp = function(a, b) {
    return a.toString() === b.toString();
  };

  /**
   * Are two values equal, deep compare for objects and arrays.
   * @param a {any}
   * @param b {any}
   * @return {boolean} Are equal?
   */
  const equal = function(a, b) {
    if (a !== b) {
      const atype = whatis(a);
      const btype = whatis(b);

      if (atype === btype) {
        return _equal.hasOwnProperty(atype) ? _equal[atype](a, b) : a == b;
      }

      return false;
    }

    return true;
  };

  return compare(a, b);
}

/*
 * Returns the resulting object of the difference between two objects
 * @param {Object} obj2
 * @param {Object} obj1
 * @returns {Object}
 */
export function diffObject(obj2, obj1) {
  const diff = {};
  forEach(obj1, (value, key) => {
    if (!obj2.hasOwnProperty(key) && isPlainObject(value)) {
      diff[key] = diffObject({}, value);
    }
  });
  forEach(obj2, (value, key) => {
    if (!obj1.hasOwnProperty(key)) {
      diff[key] = value;
    } else if (value !== obj1[key]) {
      if (isPlainObject(value) && isPlainObject(obj1[key])) {
        if (isEmpty(value)) {
          if (!isEmpty(obj1[key])) {
            diff[key] = {};
          }
        } else {
          const d = diffObject(value, obj1[key]);
          if (Object.keys(d).length > 0) {
            diff[key] = d;
          }
        }
      } else if (!isArray(value) || !isArray(obj1[key]) || !deepArrayEquals(value, obj1[key])) {
        diff[key] = value;
      }
    }
  });
  return diff;
}


/*
 * loops through an object or array
 * @param {Object|Array} obj object or array
 * @param {Function} callback callback function
 * @param {Object} ctx context object
 */
function forEach(obj, callback, ctx) {
  if (!obj) {
    return;
  }
  let i, size;
  if (isArray(obj)) {
    size = obj.length;
    for (i = 0; i < size; i += 1) {
      const result = callback.apply(ctx, [obj[i], i]);
      if (result === false) {
        break;
      }
    }
  } else {
    const keys = Object.keys(obj);
    size = keys.length;
    for (i = 0; i < size; i += 1) {
      const result = callback.apply(ctx, [obj[keys[i]], keys[i]]);
      if (result === false) {
        break;
      }
    }
  }
}

/*
 * checks whether obj is an Array
 * @param {Object} target
 * @returns {Boolean}
 * from underscore: https://github.com/jashkenas/underscore/blob/master/underscore.js
 */
const isArray = Array.isArray || (target => Object.prototype.toString.call(target) === "[object Array]");


// Deep extend and helper functions
// https://github.com/unclechu/node-deep-extend/blob/master/lib/deep-extend.js

function isSpecificValue(val) {
  return Boolean((
    val instanceof Date
    || val instanceof RegExp
  ));
}

function cloneSpecificValue(val) {
  if (val instanceof Date) {
    return new Date(val.getTime());
  } else if (val instanceof RegExp) {
    return new RegExp(val);
  }
  throw new Error("Unexpected situation");
}

/**
 * Recursive cloning array.
 */
function deepCloneArray(arr) {
  const clone = [];
  forEach(arr, (item, index) => {
    if (typeof item === "object" && item !== null) {
      if (isArray(item)) {
        clone[index] = deepCloneArray(item);
      } else if (isSpecificValue(item)) {
        clone[index] = cloneSpecificValue(item);
      } else {
        clone[index] = deepExtend({}, item);
      }
    } else {
      clone[index] = item;
    }
  });
  return clone;
}


function isEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}


/*
 * checks whether obj is a plain object {}
 * @param {Object} obj
 * @returns {Boolean}
 */
function isPlainObject(obj) {
  return obj !== null && Object.prototype.toString.call(obj) === "[object Object]";
}

function deepArrayEquals(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;
  for (let i = 0; i < a.length; ++i) {
    if (isPlainObject(a[i]) && isPlainObject(b[i])) {
      if (!comparePlainObjects(a[i], b[i])) return false;
    } else if (a[i] !== b[i]) return false;
  }
  return true;
}

export function removeProperties(obj, array, keyStack = "") {
  Object.keys(obj).forEach(key => {
    if (array.some(s => (keyStack + "." + key).endsWith(s)))
      delete obj[key];
    else
      (obj[key] && typeof obj[key] === "object") && removeProperties(obj[key], array, keyStack + "." + key);
  });
  return obj;
}

export function randomSlug(base = "bubbles-") {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz234567';
  const timestamp = String(new Date().valueOf() - new Date("2025-01-01").valueOf()).substr(0,8)
  const suffix = Array.from(crypto.getRandomValues(new Uint8Array(2)))
    .map(x => alphabet[x % alphabet.length])
    .join('');
  return base + timestamp + suffix;
}

export function randomToken(length = 32) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz234567';  
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(x => alphabet[x % alphabet.length])
    .join('');
}

export async function hashSHA2(string) {
  if(!string) return null;
  const utf8 = new TextEncoder().encode(string);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

// Add this function (computes expiry date from lifetime like "1 week", "1 month", "6 month", "1 year")
export function computeExpiryDate(lifetime, fromDate = new Date()) {
  if (!lifetime) return null;
  const s = String(lifetime).trim().toLowerCase();
  if (s === 'never') return null;

  const m = s.match(/^(\d+)\s*(day|week|month|year)s?$/);
  if (!m) return null;

  const n = parseInt(m[1], 10);
  const unit = m[2];

  const d = new Date(fromDate.getTime());

  switch (unit) {
    case 'day':
      d.setDate(d.getDate() + n);
      break;
    case 'week':
      d.setDate(d.getDate() + n * 7);
      break;
    case 'month':
      // setMonth handles month overflow (e.g., adding to Jan 31)
      d.setMonth(d.getMonth() + n);
      break;
    case 'year':
      d.setFullYear(d.getFullYear() + n);
      break;
    default:
      return null;
  }

  return d.toISOString();
}

export async function fetchJSON(url, options){ let ok, error; await d3.json(url, options).then(d => ok = d).catch(e => error = e); return {ok, error}; }

export function getVideoIframeHTMLTemplate(src, title="Embedded video"){
  // ensure YT API can pause: add enablejsapi=1&origin=...
  const addParam = (u, k, v) => {
    const url = new URL(u, location.origin);
    if (!url.searchParams.has(k)) url.searchParams.set(k, v);
    return url.toString();
  };

  if (src.includes("youtube")) {
    const yt = addParam(addParam(src, "enablejsapi", "1"), "origin", location.origin);
    return `<iframe
      style="width:100%;height:100%;aspect-ratio:16/9;border:0"
      src="${yt}"
      title="${title}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
  }

  if (src.includes("vimeo")) return `<iframe 
    src="${src}" 
    style="width:100%;height:100%;border:0"
    title="${title}"
    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
    allowfullscreen></iframe>
  <script src="https://player.vimeo.com/api/player.js"></script>`;

  return "";
}

// Stop playback for embedded iframes (YT/Vimeo), with hard fallback
export function stopEmbeddedVideo(containerOrIframe) {
  const iframe = containerOrIframe?.tagName === 'IFRAME'
    ? containerOrIframe
    : containerOrIframe?.querySelector?.('iframe');
  if (!iframe) return;

  const src = iframe.getAttribute('src') || "";

  // Try YouTube postMessage API
  if (/youtube\.com|youtu\.be/.test(src)) {
    try {
      iframe.contentWindow?.postMessage(JSON.stringify({
        event: 'command',
        func: 'pauseVideo',
        args: []
      }), '*');
    } catch (e) {}
  }

  // Try Vimeo API (player.js) or postMessage
  if (/vimeo\.com/.test(src)) {
    try {
      if (window.Vimeo && window.Vimeo.Player) {
        new window.Vimeo.Player(iframe).pause().catch(()=>{});
      } else {
        iframe.contentWindow?.postMessage({ method: 'pause' }, '*');
      }
    } catch (e) {}
  }

  // Hard fallback: unload/remove the iframe
  try { iframe.src = 'about:blank'; } catch (e) {}
  try { iframe.remove(); } catch (e) {}
}

export function mailtoUrl({ to, subject, body, cc, bcc }) {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  if (cc) params.set("cc", cc);
  if (bcc) params.set("bcc", bcc);
  const toList = Array.isArray(to) ? to.join(",") : (to || "");
  const qs = params.toString();
  return `mailto:${toList}${qs ? `?${qs}` : ""}`;
}

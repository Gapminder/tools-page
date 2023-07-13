/* eslint no-prototype-builtins: "off" */

export function scrollTo({ durationLeft = 200, element, complete }) {
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
    if (!text) return;
    const textChildNode = Array.from(el.node().childNodes)
      .filter(({ nodeName }) => nodeName === "#text")[0];
    if (textChildNode) {
      textChildNode.textContent = translator(text);
    } else {
      el.text(translator(text));
    }
  };
}

export function loadJS(url, location, className) {
  //url is URL of external file, implementationCode is the code
  //to be called from the file, location is the location to
  //insert the <script> element
  return new Promise((resolve, reject) => {
    const scriptTag = document.createElement("script");
    if (className) scriptTag.classList.add(className);
    scriptTag.src = url;
    scriptTag.onerror = reject;
    scriptTag.onload = resolve;
    scriptTag.onreadystatechange = resolve;
    location.appendChild(scriptTag);
  });
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


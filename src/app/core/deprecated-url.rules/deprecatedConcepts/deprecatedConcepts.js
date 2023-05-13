import { encodeUrlHash, decodeUrlHash } from "../../url.js";

const rule = {
  test(url) {
    const hashIndex = url.indexOf("#");
    if (hashIndex == -1) return false;

    const hash = url.substr(hashIndex + 1);
    let state = {};
    try {
      state = urlon.parse(decodeUrlHash(hash) || "$;");
    }
    catch {
      console.warn("Unable to decode and parse the hash:", hash);
      return false;
    }

    return findInState(state, toolsPage_conceptMapping);
  },

  use(url) {
    const hashIndex = url.indexOf("#");
    const hashPrefix = url.substr(0, hashIndex);
    const hash = url.substr(hashIndex + 1);

    const state = urlon.parse(decodeUrlHash(hash) || "$;");
    const newState = replaceInState(state, toolsPage_conceptMapping);

    return hashPrefix + "#" + encodeUrlHash(urlon.stringify(newState));
  }
};

function findInState(state, conceptMapping) {
  return Object.entries(state).some(([key, value]) => {
    if (key === "concept" && conceptMapping[state.concept]) {
      return true;
    }
    if (typeof value == "object" && value != null) {
      return findInState(value, conceptMapping);
    }
    return false;
  });
}

function replaceInState(state, conceptMapping) {
  const newState = {};
  Object.entries(state).forEach(([key, value]) => {
    if (key === "concept" && conceptMapping[value]) {
      Object.assign(newState, conceptMapping[value]);
      console.log("Replaced concept:" + value + " by " + JSON.stringify(conceptMapping[value]));
    } else if (typeof value == "object" && value != null && !Array.isArray(value)) {
      newState[key] = replaceInState(value, conceptMapping);
    } else {
      newState[key] = value;
    }
  });
  return newState;
}

export default rule;

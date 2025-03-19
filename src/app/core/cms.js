let DOCID_CMS, DOCID_I18N, DEFAULT_LOCALE;
const resetCache = true;
const TIMEOUT_MS = 2000; // adjust timeout duration

const donothing = d => d;

// Define your per-sheet validations.
const validation = {
  toolconfig: data => data && data.length > 0,
  toolset: data => data && data.length > 0,
  properties: data => data && data.length > 0,
  datasources: data => data && data.length > 0,
  menu: data => data && data.length > 0,
  related: data => !!data,
};

const parsing = page => {
  const parsers = {
    "toolset": defaultParser,
    "toolconfig": groupedParser,
    "properties": data => arrayToObject(defaultParser(data)),
    "datasources": arrayToObject,
  };
  return page.type === "language" ? parseLanguageStrings : (parsers[page.sheet] || donothing);
};

function groupedParser(data){
  return d3.rollup(
    data, 
    v => nestObject(arrayToObject( v.map(({key, value})=> {
      //special case for frame values, which remain remain strings like vizabi expects
      //otherwise this gives unnecessary URL state as types don't match
      if (key.endsWith("encoding.frame.value")) return { key, value: ducktypeAndParseValue(value, {numbers: false}) };
      return { key, value: ducktypeAndParseValue(value) };
    } ))), 
    d => d["tool_id"]);
}

function defaultParser(data){
  return data.map(entry => {
    const result = {};
    for (let key of Object.keys(entry)){
      result[key] = ducktypeAndParseValue(entry[key]);
    }
    return result;
  });
}

function parseLanguageStrings(data) {
  return nestObject(arrayToObject(
    data.map(({key, value}) => ({key, value: ducktypeAndParseValue(value, {arrays: false, trim: false})}))
  ));
}

function arrayToObject(data) {
  return Object.fromEntries(data.map(entry => ([entry.key, entry.hasOwnProperty("value") ? entry.value : entry])));
}

function ducktypeAndParseValue(value, {arrays = true, booleans = true, numbers = true, trim = true} = {}){
  //null
  if (value === "")
    return null;
  //array
  if (arrays && value.includes(","))
    return value.split(",").map(m => ducktypeAndParseValue(m))
  //boolean
  if (booleans && ["true", "false", "TRUE", "FALSE"].includes(value))
    return ["true", "TRUE"].includes(value);
  //number
  if (numbers && !isNaN(parseFloat(value)))
    return parseFloat(value);
  //string
  return trim ? value.trim() : value;
}


function nestObject(flat) {
  const nested = {};
  for (const key in flat) {
    if (!Object.prototype.hasOwnProperty.call(flat, key)) continue;
    const value = flat[key];
    // Split on "." only, leave other symbols (like / or -) intact.
    const parts = key.split('.');
    let current = nested;
    // Walk through each part except the last, creating objects as needed
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }
    // Set the final part to the value
    current[parts[parts.length - 1]] = value;
  }
  return nested;
}



const getPages = (locale = DEFAULT_LOCALE) => ([
  { docid: DOCID_CMS, sheet: "toolconfig", fallbackContent: {} },
  { docid: DOCID_CMS, sheet: "toolset", fallbackContent: toolsPage_toolset },
  { docid: DOCID_CMS, sheet: "properties", fallbackContent: toolsPage_properties },
  { docid: DOCID_CMS, sheet: "datasources", fallbackContent: toolsPage_datasources },
  { docid: DOCID_CMS, sheet: "menu", fallbackContent: toolsPage_menuItems },
  { docid: DOCID_CMS, sheet: "related", fallbackContent: "" },
  { docid: DOCID_I18N, sheet: `page/${locale}`, type: "language", fallbackPath: `./assets/i18n/${locale}.json` },
  { docid: DOCID_I18N, sheet: `tools/${locale}`, type: "language", fallbackPath: `./assets/translation/${locale}.json` },
]);

function setSettings(settings = {}){
  DOCID_CMS = settings.DOCID_CMS;
  DOCID_I18N = settings.DOCID_I18N;
  DEFAULT_LOCALE = settings.DEFAULT_LOCALE;
}
function getSettings(){
  return {DOCID_CMS, DOCID_I18N, DEFAULT_LOCALE};
}

function getCacheID(page) {
  return page.docid + page.sheet;
}


const cache = {};

function loadSheet(page) {
  const cached = cache[getCacheID(page)];
  if(cached) return Promise.resolve(cached);

  const sheet = page.sheet;
  const docid = page.docid;
  const cacheSuffix = resetCache ? `&cache=${new Date()}` : "";
  const remoteUrl = `https://docs.google.com/spreadsheets/d/${docid}/gviz/tq?tqx=out:csv&sheet=${sheet}${cacheSuffix}`;
  const localUrl = page.fallbackPath || `./config/${sheet}.json`;

  // Attempt remote load with timeout
  const remoteLoad = new Promise((resolve, reject) => {
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      reject(new Error("Timeout"));
    }, TIMEOUT_MS);

    d3.csv(remoteUrl)
      .then(data => {
        if (timedOut) return; // ignore result if already timed out
        clearTimeout(timer);
        // Validate remote content if a validator exists for this sheet.
        if (validation[sheet] && !validation[sheet](data)) {
          reject(new Error("Validation failed for remote sheet"));
        } else {
          const parsedResult = parsing(page)(data);
          cache[getCacheID(page)] = parsedResult;
          resolve(parsedResult);
        }
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });

  // Fallback to local file if remote load fails for any reason.
  return remoteLoad.catch(err => {
    if (page.fallbackContent) {
      console.warn(`Remote load for sheet "${sheet}" failed: ${err.message}. Falling back to local content`, page.fallbackContent);  
      return Promise.resolve(page.fallbackContent)
    }
    console.warn(`Remote load for sheet "${sheet}" failed: ${err.message}. Falling back to local file: ${localUrl}`);
    return d3.json(localUrl)
      .then(data => {
        if (validation[sheet] && !validation[sheet](data)) {
          throw new Error(`Validation failed for local fallback of sheet "${sheet}"`);
        }
        cache[getCacheID(page)] = data;
        return data;
      });
  });
}

async function load(settings) {
  setSettings(settings);
  const pages = getPages();
  return Promise.all(
    pages.map(page => loadSheet(page))
  ).then(response => {
    const result = Object.fromEntries(pages.map((page, i) => ([page.sheet, response[i]])));
    console.log("All sheets loaded:", result);
    return result;
  }).catch(err => {
    console.error("Error loading one or more sheets:", err);
  });
}

export { load, loadSheet, getSettings };



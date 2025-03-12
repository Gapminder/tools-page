
const DOCID_CMS = "1T7xgVBfqGu50gqr-LFFcQyCKMRrwLYO0onZi-G3nZZQ";
const DOCID_I18N = "1iJvxJhlRo32cu_oT1cSvttKddQPWspveOfqSM6Uy7Ek";
const resetCache = true;
const TIMEOUT_MS = 2000; // adjust timeout duration

const donothing = d => d;

// Define your per-sheet validations.
const validation = {
  toolconfig: data => data && data.length > 0,
  toolset: data => data && data.length > 0,
  properties: data => data && data.length > 0,
  datasources: data => data && data.length > 0,
  related: data => data && data.length > 0,
};

const parsing = page => {
  const parsers = {
    "toolset": parseValuesToArray,
    "datasources": parseToKVP,
  };
  return page.type === "language" ? parseLanguageStrings : (parsers[page.sheet] || donothing);
};

function parseLanguageStrings(data) {
  data = data.map(({key, value}) => ({key, value: parseBoolean(value)}))
  return nestObject(Object.fromEntries(data.map(({ key, value }) => ([key, value]))));
}

function parseBoolean(value){
  return ["true", "false", "TRUE", "FALSE"].includes(value) ? ["true", "TRUE"].includes(value) : value;
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

function parseToKVP(data) {
  return Object.fromEntries(data.map((entry) => ([entry.key, entry.value || entry])));
}

function parseValuesToArray(data){
  const columnsToParse = ["toolComponents", "dataSources"];
  return data.map(entry => {
    const result = {};
    for (let key of Object.keys(entry)){
      if (entry[key] === "") {
        result[key] = null;
      } else if (columnsToParse.includes(key)){
        result[key] = entry[key].split(",").map(m => m.trim());
      } else {
        result[key] = entry[key];
      }
    }
    return result;
  })
}

const pages = [
  { docid: DOCID_CMS, sheet: "toolconfig" },
  { docid: DOCID_CMS, sheet: "toolset" },
  { docid: DOCID_CMS, sheet: "properties" },
  { docid: DOCID_CMS, sheet: "datasources" },
  { docid: DOCID_CMS, sheet: "related" },
  { docid: DOCID_I18N, sheet: "page/en", type: "language" },
  { docid: DOCID_I18N, sheet: "tools/en", type: "language" },
];


function getSettings(){
  return {DOCID_CMS, DOCID_I18N};
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
  const localUrl = `./config/${sheet}.json`;

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
    console.warn(`Remote load for sheet "${sheet}" failed: ${err.message}. Falling back to local file.`);
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

async function load() {
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



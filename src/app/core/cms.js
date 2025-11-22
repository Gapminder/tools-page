import toolsPage_properties from "toolsPage_properties";
import { supabaseClient } from "../auth/supabase.service";
import { resolveAssetUrl } from "./utilsForAssetPaths.js";

let DOCID_CMS, DOCID_I18N, DEFAULT_LOCALE, SITE, PAGE_SLUG, PAGE_ID;
const resetCache = true;
const TIMEOUT_MS = 2000; // adjust timeout duration

const donothing = d => d;

// Define your per-sheet validations.
const validation = {
  toolconfig: data => data && data.length > 0,
  toolset: data => data && data.length > 0,
  properties: data => data && data.length > 0,
  datasources: data => data && data.length > 0,
  related: data => !!data,
  theme_components: data => !!data,
  menu_items: data => !!data,
  footer_links: data => Array.isArray(data),
  footer_logos: data => Array.isArray(data),
  theme_meta: data => !!data,
  theme_layout: data => !!data,
  theme_fonts: data => !!data,
  theme_style: data => !!data,
  theme_variables: data => !!data,
  locales: data => Array.isArray(data),
};

const parsing = page => {
  const parsers = {
    "toolset": defaultParser,
    "toolconfig": data => ({
      essential: d3.rollup(data.filter(f => f.type === "essential"), v => v[0] && v[0].config, d=> d.tool_id),
      preferential: d3.rollup(data.filter(f => f.type === "preferential"), v => v[0] && v[0].config, d=> d.tool_id)
    }), 
    "properties": data => arrayToObject(defaultParser(data)),
    "datasources": data => arrayToObject(data.map(d => Object.assign(d.reader_properties, {
      key: d.ds_id,
      modelType: d.reader
    }))),
  };
  return page.type === "language" ? parseLanguageStrings : (parsers[page.sheet] || donothing);
};

function groupedParser(data) {
  return d3.rollup(
    data,
    v => nestObject(arrayToObject(v.map(({ key, value }) => {
      //special case for frame values, which remain remain strings like vizabi expects
      //otherwise this gives unnecessary URL state as types don't match
      if (key.endsWith("encoding.frame.value")) return { key, value: ducktypeAndParseValue(value, { numbers: false }) };
      if (key.endsWith("space")) return { key, value: ensureArray(value) };
      return { key, value: ducktypeAndParseValue(value) };
    }))),
    d => d["tool_id"]);
}

function ensureArray(arg) {
  if(Array.isArray(arg)) return arg;
  return arg ? arg.split(",").filter(f => f).map(m => ducktypeAndParseValue(m)) : [];
}

function defaultParser(data) {
  return data.map(entry => {
    const result = {};
    for (const key of Object.keys(entry)) {
      if (["dataSources", "toolComponents"].includes(key)) result[key] = ensureArray(entry[key]);
      else
        result[key] = ducktypeAndParseValue(entry[key]);
    }
    return result;
  });
}

function parseLanguageStrings(data) {
  return nestObject(arrayToObject(
    data.map(({ key, value }) => ({ key, value: ducktypeAndParseValue(value, { arrays: false, trim: false }) }))
  ));
}

function arrayToObject(data, key) {
  return Object.fromEntries(data.map(entry => ([entry[key ? key : "key"], entry.hasOwnProperty("value") ? entry.value : entry])));
}

function ducktypeAndParseValue(value, { arrays = true, booleans = true, numbers = true, trim = true } = {}) {
  if (typeof value !== "string") return value;
  //null
  if (value === "" || value === "null")
    return null;
  //array
  if (arrays && value.includes(","))
    return value.split(",").map(m => ducktypeAndParseValue(m));
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
    const parts = key.split(".");
    let current = nested;
    // Walk through each part except the last, creating objects as needed
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part] || typeof current[part] !== "object") {
        current[part] = {};
      }
      current = current[part];
    }
    // Set the final part to the value
    current[parts[parts.length - 1]] = value;
  }
  return nested;
}


const getPages = (locale = DEFAULT_LOCALE, site = SITE, pageSlug = PAGE_SLUG) => {
  const configFolder = `config${site ? "/"+site : ""}${pageSlug ? "--"+pageSlug : ""}`;
  return [
    {getFromDB: getToolConfigs, sheet: "toolconfig", fallbackContent: {preferential: new Map(), essential: new Map()} },
    
    {getFromDB: getThemeComponents, sheet: "theme_components", fallbackContent: toolsPage_properties.theme_components || {} },
    {getFromDB: getMenuItems, sheet: "menu_items", fallbackContent: toolsPage_properties.menu_items || {} },
    {getFromDB: getFooterLinks, sheet: "footer_links", fallbackContent: toolsPage_properties.footer_links || [] },
    {getFromDB: getFooterLogos, sheet: "footer_logos", fallbackContent: toolsPage_properties.footer_logos || [] },
    {getFromDB: getThemeMeta, sheet: "theme_meta", fallbackContent: toolsPage_properties.theme_meta || {} },
    {getFromDB: getThemeLayout, sheet: "theme_layout", fallbackContent: toolsPage_properties.theme_layout || {} },
    {getFromDB: getThemeFonts, sheet: "theme_fonts", fallbackContent: toolsPage_properties.theme_fonts || {} },
    {getFromDB: getThemeStyle, sheet: "theme_style", fallbackContent: toolsPage_properties.theme_style || {} },
    {getFromDB: getThemeVariables, sheet: "theme_variables", fallbackContent: toolsPage_properties.theme_variables || {} },
    {getFromDB: getLocales, sheet: "locales", fallbackContent: toolsPage_properties.locales || [] },
    
    {getFromDB: getToolset, sheet: "toolset", fallbackPath: configFolder+"/toolset.json"},
    {getFromDB: getDatasources, sheet: "datasources", fallbackPath: configFolder+"/datasources.json"},
    {getFromDB: getRelated, sheet: "related", fallbackPath: configFolder+"/related.json" },

    {getFromDB: getConceptMapping, sheet: "concept_mapping", fallbackPath: configFolder+"/conceptMapping.json" },
    {getFromDB: getEntityMapping, sheet: "entity_mapping", fallbackPath: configFolder+"/entityMapping.json" },

    {getFromDB: getDefaultLocalePackageForPage, locale, sheet: `page/${locale}`, fallbackPath: `assets/i18n/${locale}.json` },
    {getFromDB: getDefaultLocalePackageForVizabi, locale, sheet: `vizabi/${locale}`, fallbackPath: `assets/translation/${locale}.json` }
  ]
};

function setSettings(settings = {}) {
  DOCID_CMS = settings.DOCID_CMS;
  DOCID_I18N = settings.DOCID_I18N;
  DEFAULT_LOCALE = settings.DEFAULT_LOCALE;
  SITE = settings.site;
  PAGE_SLUG = settings.pageSlug
  PAGE_ID = settings.id;
}
function getSettings() {
  return { DOCID_CMS, DOCID_I18N, DEFAULT_LOCALE, SITE, PAGE_SLUG, PAGE_ID};
}

function getCacheID(page) {
  return page.docid + page.sheet;
}


const cache = {};

function loadSheet(page) {
  const cached = cache[getCacheID(page)];
  if (cached) return Promise.resolve(cached);

  const sheet = page.sheet;
  const docid = page.docid;
  const cacheSuffix = resetCache ? `&cache=${new Date()}` : "";
  const remoteUrl = `https://docs.google.com/spreadsheets/d/${docid}/gviz/tq?tqx=out:csv&sheet=${sheet}${cacheSuffix}`;
  const localUrl = resolveAssetUrl(page.fallbackPath || `config/${sheet}.json`);

  // Attempt remote load with timeout
  const remoteLoad = new Promise((resolve, reject) => {
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      reject(new Error("Timeout"));
    }, TIMEOUT_MS);

    (page.getFromDB ? page.getFromDB(page.pageId, page.locale) : d3.csv(remoteUrl))
      .then(data => {
        if (timedOut) return; // ignore result if already timed out
        clearTimeout(timer);
        // Validate remote content if a validator exists for this sheet.
        if (validation[sheet] && !validation[sheet](data)) {
          reject(new Error(`Validation failed for remote configuration sheet ${sheet}`));
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
      console.warn(`🛢 Remote load for sheet "${sheet}" failed: ${err.message}. Falling back to local content`, page.fallbackContent);
      return Promise.resolve(page.fallbackContent);
    }
    console.warn(`🛢 Remote load for sheet "${sheet}" failed: ${err.message}. Falling back to local file: ${localUrl}`);
    return d3.json(localUrl)
      .then(data => {
        if (validation[sheet] && !validation[sheet](data)) {
          throw new Error(`Validation failed for local fallback of configuration sheet "${sheet}"`);
        }
        const parsedResult = parsing(page)(data);
        cache[getCacheID(page)] = parsedResult;
        return parsedResult;
      })
      .catch(err => {
        console.error(`Error loading local configuration sheet ${localUrl}`, err);
      });
  });
}

async function load(settings) {
  const {id, locales} = await getCachedPageInfo(settings.site, settings.pageSlug);
  if (locales && locales.length > 0) settings.DEFAULT_LOCALE = locales[0];
  if (id) settings.id = id;
  setSettings(settings);
  const pages = getPages();
  return Promise.all(
    pages.map(page => loadSheet({...page, pageId: id, locale: DEFAULT_LOCALE}))
  ).then(response => {
    const cmsData = Object.fromEntries(pages.map((page, i) => ([page.sheet, response[i]])));
    return {pageId: id, cmsData, defaultLocale: DEFAULT_LOCALE};
  }).catch(err => {
    console.error("Error loading one or more sheets:", err);
  });
}

let pageInfoCache = null;
async function getCachedPageInfo(site = SITE, pageSlug = PAGE_SLUG) {
  if (pageInfoCache) return pageInfoCache;
  if (!supabaseClient) return {};
  if(!site) return null;
  const { data, error } = await supabaseClient
    .from("pages")
    .select("*")
    .eq("site", site)
    .eq("slug", pageSlug || "__home__")
    .single();

  if (error) {
    console.error(error);
    pageInfoCache = {};
    return {};
  }
  pageInfoCache = data;
  return data;
}

async function getThemeComponents() {const info = await getCachedPageInfo(); return info && info.theme_components;}
async function getMenuItems() {const info = await getCachedPageInfo(); return info && info.menu_items;}
async function getFooterLinks() {const info = await getCachedPageInfo(); return info && info.footer_links;}
async function getFooterLogos() {const info = await getCachedPageInfo(); return info && info.footer_logos;}
async function getThemeMeta() {const info = await getCachedPageInfo(); return info && info.theme_meta;}
async function getThemeLayout() {const info = await getCachedPageInfo(); return info && info.theme_layout;}
async function getThemeFonts() {const info = await getCachedPageInfo(); return info && info.theme_fonts;}
async function getThemeStyle() {const info = await getCachedPageInfo(); return info && info.theme_style;}
async function getThemeVariables() {const info = await getCachedPageInfo(); return info && info.theme_variables;}
async function getLocales() {const info = await getCachedPageInfo(); return info && info.locales ;}
async function getConceptMapping() {const info = await getCachedPageInfo(); return info && info.concept_mapping;}
async function getEntityMapping() {const info = await getCachedPageInfo(); return info && info.entity_mapping;}



async function getToolset(pageId) {
  if (!supabaseClient) throw new Error("Supabase is not configured");
  const { data, error } = await supabaseClient
    .from("tools")
    .select("*, datasources(ds_id)")
    .eq("page_id", pageId)
    .order("rank");
  if (error) {
    throw(error);
  } else {
    return data.map(m => ({
      id: m.tool_id,
      tool: m.tool,
      config: m.config,
      title: m.title,
      image: m.image,
      icon: m.icon,
      url: m.url,
      icon_inline: m.icon_inline,
      transition: m.transition,
      mainMarker: m.main_marker,
      toolVariation: m.tool_variation,
      toolComponents: m.tool_components,
      hideThumbnail: m.hide_thumbnail,
      dataSources: m.datasources.map(ds => ds.ds_id).join(",")
    }));
  }
}

async function getToolConfigs(pageId) {
  if (!supabaseClient) throw new Error("Supabase is not configured");
  const { data, error } = await supabaseClient
    .from("configs")
    .select("tool_id, type, config")
    .eq("page_id", pageId)
  if (error) {
    throw(error);
  } else {
    return data;
  }
}

async function getDatasources(pageId) {
  if (!supabaseClient) throw new Error("Supabase is not configured");
  const { data, error } = await supabaseClient
    .from("datasources")
    .select("*")
    .eq("page_id", pageId)
  if (error) {
    throw(error);
  } else {
    return data;
  }
}

async function getRelated(pageId) {
  if (!supabaseClient) throw new Error("Supabase is not configured");
  const { data, error } = await supabaseClient
    .from("related")
    .select("*")
    .eq("page_id", pageId)
    .order("rank");
  if (error) {
    throw(error);
  } else {
    return data;
  }
}

async function getDefaultLocalePackageForPage(pageId, locale) {
  return getLocalePackage({pageId, locale, scope: "page"});
}

async function getDefaultLocalePackageForVizabi(pageId, locale) {
  return getLocalePackage({pageId, locale, scope: "vizabi"});
}

async function getLocalePackage({pageId = PAGE_ID, locale = DEFAULT_LOCALE, scope} = {}) {
  if (!supabaseClient) throw new Error("Supabase is not configured");
  if (!scope) throw new Error("loadLocalePackage: missing the required parameter 'scope'");
  const { data, error } = await supabaseClient
    .from("translations")
    .select("spec")
    .eq("scope", scope)
    .eq("page_id", pageId)
    .eq("locale", locale)
    .single();

  if (error) {
    throw(error);
  } else {
    return data.spec;
  }
}

async function loadLocalePackage(locale, scope) {
  let getFromDB, sheet, fallbackPath;
  if (scope === "page") {
    getFromDB = getDefaultLocalePackageForPage;
    sheet = `page/${locale}`;
    fallbackPath = `./assets/i18n/${locale}.json`;
  } else if (scope === "vizabi") {
    getFromDB = getDefaultLocalePackageForVizabi;
    sheet = `vizabi/${locale}`;
    fallbackPath = `./assets/translation/${locale}.json`;
  } else {
    throw new Error("loadLocalePackage: missing the required parameter 'scope'");
  }
  return loadSheet({getFromDB, sheet: `${scope}/${locale}`, fallbackPath})
}

export { load, getSettings, loadLocalePackage };



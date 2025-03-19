import * as cms from "./cms.js";

let defaultLocale;
let availableLocales;
let getStateLocale;
const dictionary = {};

function getLocaleDisplayName(locale){
  const languageId = locale.split("-")[0];
  const dn = new Intl.DisplayNames([languageId], {type: 'language'});
  return dn.of(locale).split(" ")[0]; 
}

function setLocalePageClasses() {
  const locale = getStateLocale();
  const langId = locale.split("-")[1];
  d3.select("html")
    .attr("lang", langId)
    .attr("class", langId);
  d3.select(".wrapper")
    .classed("page-lang-rtl", dictionary[locale].isRtl);
}

function translator(key) {
  if(availableLocales.includes(key)) return getLocaleDisplayName(key);
  const locale = getStateLocale();
  return dictionary[locale] && dictionary[locale][key] 
    || dictionary[defaultLocale] && dictionary[defaultLocale][key] 
    || null;
}

function loadData(locale, prefix = "page", folder = "i18n"){
  const {DOCID_I18N} = cms.getSettings();
  return cms.loadSheet({ 
    docid: DOCID_I18N, 
    sheet: `${prefix}/${locale}`,
    type: "language", 
    fallbackPath: `./assets/${folder}/${locale}.json` 
  });
}

async function initTranslator(state, locales) {
  getStateLocale = getStateLocale || state.getLocale;
  availableLocales = availableLocales || locales;
  defaultLocale = cms.getSettings().DEFAULT_LOCALE;
  dictionary[defaultLocale] = await loadData(defaultLocale, "page", "i18n");
  
  const locale = getStateLocale();
  if(locale !== defaultLocale) dictionary[locale] = await loadData(locale, "page", "i18n");
  
  setLocalePageClasses();
  return translator;
}

function getFileReaderForVizabi(locale){
  return loadData(locale, "tools", "translation");
}

export {
  initTranslator,
  getFileReaderForVizabi
};

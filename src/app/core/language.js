import * as cms from "./cms.js";

let defaultLocale;
let availableLocales;
let getStateLocale;
const dictionary = {};

function getLocaleDisplayName(locale) {
  /*
    longest locale Display names
    "azərbaycan"
    "Belarusian"
    "Australian"
    "Macedonian"
    "Nederlands"
    "slovenčina"
    "українська"
    "Kinyarwanda"
    "slovenščina"
    "Luxembourgish"
    "Österreichisches"
  */
  const languageId = locale.split("-")[0];
  const dn = new Intl.DisplayNames([languageId], { type: "language" });
  return dn.of(locale).split(" ")[0];
}

function setLocalePageClasses() {
  const locale = getStateLocale();
  const langId = locale.split("-")[1] || locale; //exception for "en"
  d3.select("html")
    .attr("lang", langId)
    .attr("class", langId);
  d3.select(".wrapper")
    .classed("page-lang-rtl", dictionary[locale].isRtl);
}

function translator(key) {
  //get name of language for language switchers and such
  if (availableLocales.includes(key)) return getLocaleDisplayName(key);
  const locale = getStateLocale();
  return dictionary[locale] && dictionary[locale][key]
    || dictionary[defaultLocale] && dictionary[defaultLocale][key]
    || null;
}

async function initTranslator(state, locales) {
  getStateLocale = getStateLocale || state.getLocale;
  availableLocales = availableLocales || locales;
  defaultLocale = cms.getSettings().DEFAULT_LOCALE;
  dictionary[defaultLocale] = await cms.loadLocalePackage(defaultLocale, "page");

  const locale = getStateLocale();
  if (locale !== defaultLocale) dictionary[locale] = await cms.loadLocalePackage(locale, "page");

  setLocalePageClasses();
  return translator;
}

function getFileReaderForVizabi(locale) {
  return cms.loadLocalePackage(locale, "vizabi");
}

export {
  initTranslator,
  getFileReaderForVizabi
};

//import { viz } from "./tool";
import { initState, setState, getState, dispatch } from "./global.js";
import * as cms from "./cms.js";
import {
  d3json
} from "./utils";

const DEFAULT_LANGUAGE = { key: "sv-SE", text: "Svenska" };
const AVAILABLE_LANGUAGES = [
  DEFAULT_LANGUAGE,
  { key: "ar-SA", text: "العربية", isRtl: true },
  { key: "he-IL", text: "עִבְרִית", isRtl: true },
  { key: "es-ES", text: "Español", isRtl: false },
  { key: "en", text: "English", isRtl: false },
  { key: "vi-VN", text: "Tiếng Việt", isRtl: false, fontFamily: "Helvetica, Arial, Sans-Serif" },
  { key: "ru-RU", text: "Русский", isRtl: false, fontFamily: "Helvetica, Arial, Sans-Serif" },
  { key: "th-TH", text: "ภาษาไทย", isRtl: false, fontFamily: "Helvetica, Arial, Sans-Serif" }
].filter(({ key }) => toolsPage_properties["LANGUAGES"].includes(key));

const TRANSLATION_DICTIONARY = {};

function setLocale(arg) {
  if (!arg) arg = getState("locale");

  const langId = /(\w+)-*/.exec(arg)[1];
  d3.select("html")
    .attr("lang", langId)
    .attr("class", langId);

  setState("locale", arg);

  //if (!viz || !viz.services) return;
  //viz.services.locale.id = arg;
}

function loadTranslation(language) {
  return new Promise((resolve, reject) => {
    d3json("assets/i18n/" + language + ".json", (error, translation) => {
      if (error) {
        reject(error);
      } else {
        resolve(translation);
      }
    });
  });
}

// function changeLanguage(language) {
//   if (TRANSLATION_DICTIONARY[language]) {
//     translateNow();
//   } else {
//     const promises = [];
//     if (!TRANSLATION_DICTIONARY[DEFAULT_LANGUAGE.key] && language !== DEFAULT_LANGUAGE.key) {
//       promises.push(loadTranslation(DEFAULT_LANGUAGE.key).then(translation => {
//         TRANSLATION_DICTIONARY[DEFAULT_LANGUAGE.key] = translation;
//       }));
//     }
//     promises.push(loadTranslation(language).then(translation => {
//       TRANSLATION_DICTIONARY[language] = translation;
//     }));
//     Promise.all(promises).then(() => {
//       translateNow();
//     });
//   }
// }

// function translateNow() {
//   const locale = getState("locale");
//   const languageConfig = AVAILABLE_LANGUAGES.filter(({ key }) => key === locale)[0];
//   d3.select(".wrapper").classed("page-lang-rtl", languageConfig.isRtl);
//   dispatch.call("translate");
// }

function translator(key) {
  const locale = getState("locale");
  return TRANSLATION_DICTIONARY[locale]
    && TRANSLATION_DICTIONARY[locale][key] ? TRANSLATION_DICTIONARY[locale][key]
    :
    TRANSLATION_DICTIONARY[DEFAULT_LANGUAGE.key]
    && TRANSLATION_DICTIONARY[DEFAULT_LANGUAGE.key][key] ? TRANSLATION_DICTIONARY[DEFAULT_LANGUAGE.key][key] : key;
}

function initTranslator(dictionary) {
  TRANSLATION_DICTIONARY["en"] = dictionary;
}

function getFileReaderForVizabi(id){
  console.log("vizabi wants file from cms: " + id);
  const {DOCID_I18N} = cms.getSettings();
  return cms.loadSheet({ docid: DOCID_I18N, sheet: "tools/" + id, type: "language" });
}

// function setLanguage(language) {
//   setLocale(language);
//   changeLanguage(locale);
// }

// function getLanguages() {
//   return AVAILABLE_LANGUAGES;
// }

export {
  translator,
  initTranslator,
  getFileReaderForVizabi,
};

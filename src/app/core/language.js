import { viz } from "./tool";
import {
  appState,
  dispatch
} from "./global";
import {
  d3json
} from "./utils";

const DEFAULT_LANGUAGE = { key: "en", text: "English" };
const AVAILABLE_LANGUAGES = [
  DEFAULT_LANGUAGE,
  { key: "ar-SA", text: "العربية", isRtl: true },
  { key: "he-IL", text: "עִבְרִית", isRtl: true },
  { key: "es-ES", text: "Español", isRtl: false },
  { key: "vi-VN", text: "Tiếng Việt", isRtl: false, fontFamily: "Helvetica, Arial, Sans-Serif" },
  { key: "ru-RU", text: "Русский", isRtl: false, fontFamily: "Helvetica, Arial, Sans-Serif" },
  { key: "th-TH", text: "ภาษาไทย", isRtl: false, fontFamily: "Helvetica, Arial, Sans-Serif" }
].filter(({ key }) => toolsPage_properties["LANGUAGES"].includes(key));

const TRANSLATION_DICTIONARY = {};

function setLocale(arg) {
  if (!arg) arg = appState.language;

  const langId = /(\w+)-*/.exec(arg)[1];
  d3.select("html")
    .attr("lang", langId)
    .attr("class", langId);

  appState.language = arg;

  if (!viz || !viz.services) return;
  viz.services.locale.id = arg;
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

function changeLanguage(language) {
  if (TRANSLATION_DICTIONARY[language]) {
    translateNow();
  } else {
    const promises = [];
    if (!TRANSLATION_DICTIONARY[DEFAULT_LANGUAGE.key] && language !== DEFAULT_LANGUAGE.key) {
      promises.push(loadTranslation(DEFAULT_LANGUAGE.key).then(translation => {
        TRANSLATION_DICTIONARY[DEFAULT_LANGUAGE.key] = translation;
      }));
    }
    promises.push(loadTranslation(language).then(translation => {
      TRANSLATION_DICTIONARY[language] = translation;
    }));
    Promise.all(promises).then(() => {
      translateNow();
    });
  }
}

function translateNow() {
  const languageConfig = AVAILABLE_LANGUAGES.filter(({ key }) => key === appState.language)[0];
  d3.select(".wrapper").classed("page-lang-rtl", languageConfig.isRtl);
  dispatch.call("translate");
}

function translator(key) {
  return TRANSLATION_DICTIONARY[appState.language]
    && TRANSLATION_DICTIONARY[appState.language][key] ? TRANSLATION_DICTIONARY[appState.language][key]
    :
    TRANSLATION_DICTIONARY[DEFAULT_LANGUAGE.key]
    && TRANSLATION_DICTIONARY[DEFAULT_LANGUAGE.key][key] ? TRANSLATION_DICTIONARY[DEFAULT_LANGUAGE.key][key] : key;
}

function setLanguage(language) {
  setLocale(language);
  changeLanguage(appState.language);
}

function getLanguages() {
  return AVAILABLE_LANGUAGES;
}

export {
  translator,
  setLanguage,
  getLanguages
};

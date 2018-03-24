import { viz } from "./tool";
import {
  appState,
  dispatch
} from "./global";

const DEFAULT_LANGUAGE = { key: 'en', text: 'English' };
const AVAILABLE_LANGUAGES = [
  DEFAULT_LANGUAGE,
  { key: 'ar-SA', text: 'العربية', isRtl: true }
];

const TRANSLATION_DICTIONARY = {};

function setLocale(arg) {
    if (!arg) arg = appState.language;
    if (!viz || !viz.model) return;
    viz.model.locale.id = arg;
    appState.language = arg;
  }

function loadTranslation(language, callback) {
  d3.json("assets/i18n/" + language + ".json", (error, translation) => {
    if (error) return;
    callback(translation);
  })
}

function changeLanguage(language) {
  if (TRANSLATION_DICTIONARY[language]) {
    translateNow();
  } else {
    loadTranslation(language, translation => {
      TRANSLATION_DICTIONARY[language] = translation;
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
    && TRANSLATION_DICTIONARY[appState.language][key] ? TRANSLATION_DICTIONARY[appState.language][key] : key;
}

function setLanguage(language) {
  setLocale(language);
  changeLanguage(appState.language);
}

function getLanguages () {
  return AVAILABLE_LANGUAGES;
}

export {
  translator,
  setLanguage,
  getLanguages
}
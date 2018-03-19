import ChartSwitcher from "app/header/chart-switcher/chart-switcher";
import LanguageSwitcher from "app/header/language-switcher/language-switcher";
import SocialButtons from "app/header/social-buttons/social-buttons";
import Menu from "app/header/menu/menu";
import MenuMobile from "app/header/menu-mobile/menu-mobile";
import SeeAlso from "app/see-also/see-also";

import menuItems from "app/core/menu-items";
import relatedItems from "app/core/related-items";
import BitlyService from "./app/core/bitly.service";
import RelatedItems from "./app/related-items/related-items";
import Footer from "./app/footer/footer";

const dispatch = d3.dispatch("translate", "toolChanged");

const DEFAULT_LANGUAGE = { key: 'en', text: 'English' };
const AVAILABLE_LANGUAGES = [
  DEFAULT_LANGUAGE,
  { key: 'ar-SA', text: 'العربية', isRtl: true }
];

const TRANSLATION_DICTIONARY = {};

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

const languageSwitcher = new LanguageSwitcher(
  d3.select(".header .app-language-switcher"),
  translator,
  {
    languages: AVAILABLE_LANGUAGES,
    selectedLanguage: appState.language,
    onClick: d => setLanguage(d.key)
  });

const chartSwitcher = new ChartSwitcher(
  d3.select(".header .app-chart-switcher"),
  translator,
  dispatch,
  {
    tools: toolsPage.toolset,
    selectedTool: appState.tool,
    onClick: d => {
      dispatch.call("toolChanged", null, d)
      setTool(d.id)
    }
  });

const menu = new Menu(
  d3.select(".header .app-menu"),
  translator,
  dispatch,
  {
    menuItems: menuItems.children
  });

const menuMobile = new MenuMobile(
  d3.select(".header .menu-mobile"),
  translator,
  dispatch,
  {
    menu: d3.select(".header")
  });

const seeAlso = new SeeAlso(
  d3.select(".app-see-also"),
  translator,
  dispatch,
  {
    tools: toolsPage.toolset,
    selectedTool: appState.tool,
    onClick: d => {
      dispatch.call("toolChanged", null, d);
      setTool(d.id)
    }
  });

const socialButtons = new SocialButtons(
  d3.select(".social-list .app-social-buttons"),
  translator,
  dispatch,
  {
    bitlyService: BitlyService(),
    locationService: () => { },
  });

const related = new RelatedItems(
  d3.select(".app-related-items"),
  translator,
  dispatch,
  {
    relatedItems
  });

const footer = new Footer(
  d3.select(".app-footer"),
  translator,
  dispatch);

setLanguage(appState.language);

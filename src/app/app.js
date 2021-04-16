import { setTool } from "./core/tool";
import { URLI, parseURL } from "./core/url";
import { appState, dispatch } from "./core/global";
import { upgradeUrl } from "./core/deprecated-url";
import { scrollTo, deepExtend } from "./core/utils";

import {
  translator,
  setLanguage,
  getLanguages
} from "./core/language";

import ChartSwitcher from "./header/chart-switcher/chart-switcher";
import LanguageSwitcher from "./header/language-switcher/language-switcher";
import SocialButtons from "./header/social-buttons/social-buttons";
import Menu from "./header/menu/menu";
import MenuMobile from "./header/menu-mobile/menu-mobile";
import Message from "./header/message/message";
import SeeAlso from "./see-also/see-also";
import DataEditor from "./header/data-editor/data-editor";

import menuItems from "./core/menu-items";
import relatedItems from "./core/related-items";
import BitlyService from "./core/bitly.service";
import LocationService from "./core/location.service";
import RelatedItems from "./related-items/related-items";
import Footer from "./footer/footer";

const App = function() {

  Message.init(
    d3.select(".app-message"),
    translator,
    dispatch
  );

  const url = location.href;
  const upgradedUrl = upgradeUrl(url);
  if (upgradedUrl !== url) {
    location.replace(upgradedUrl);
  }

  const embeddedMatch = /embedded=(true|false)/.exec(window.location.search);
  d3.select(".wrapper").classed("embedded-view", (embeddedMatch || [])[1] === "true");

  const tools = toolsPage_toolset.filter(f => !!f.tool).map(m => m.id);
  parseURL();
  Object.assign(appState, {
    tool: (URLI["chart-type"] && tools.includes(URLI["chart-type"])) ? URLI["chart-type"] : tools[0],
    language: URLI.model?.ui?.locale || "en",
    projector: (URLI.model?.ui?.projector === "true") || false
  });

  window.history.replaceState({
    tool: appState.tool,
    model: deepExtend({}, URLI.model, true)
  }, "Title");
  setTool();

  const languageSwitcher = new LanguageSwitcher(
    d3.select(".header .app-language-switcher"),
    translator,
    dispatch,
    {
      languages: getLanguages(),
      selectedLanguage: appState.language,
      onClick: d => setLanguage(d.key)
    });

  const chartSwitcher = new ChartSwitcher(
    d3.select(".header .app-chart-switcher"),
    translator,
    dispatch,
    {
      tools: toolsPage_toolset,
      appState,
      onClick: d => {
        dispatch.call("toolChanged", null, d.id);
        setTool(d.id);
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
      tools: toolsPage_toolset,
      selectedTool: appState.tool,
      onClick: d => {
        scrollTo({
          element: d3.select(".wrapper").node(),
          complete: () => {
            dispatch.call("toolChanged", null, d.id);
            setTool(d.id);
          }
        });
      }
    });

  const socialButtons = new SocialButtons(
    d3.select(".social-list .app-social-buttons"),
    translator,
    dispatch,
    {
      bitlyService: BitlyService(),
      locationService: LocationService(),
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

  const dataEditor = new DataEditor(
    d3.select(".header .data-editor"),
    translator,
    dispatch,
    {});

  setLanguage(appState.language);
};

export default App;

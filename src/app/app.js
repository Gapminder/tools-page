import * as urlService from "./core/url.js";
import * as cmsService from "./core/cms.js";
import ThemeService from "./core/theme.js";
import { scrollTo, deepExtend } from "./core/utils";

import { initTranslator } from "./core/language.js";


import UserLogin from "./auth/user-login.js";
import Menu from "./menu/menu.js";
import Message from "./message/message.js";

// import menuItems from "./core/menu-items";
import BitlyService from "./core/bitly.service"; //TODO REFACTOR
import LocationService from "./core/location.service"; //TODO REFACTOR

import SocialButtons from "./social-buttons/social-buttons.js";
import LanguageSwitcher from "./language-switcher/language-switcher.js";
import ChartSwitcher from "./chart-switcher/chart-switcher.js";
import ChartSwitcherWithIcons from "./chart-switcher/chart-switcher-with-icons.js";
import SeeAlso from "./see-also/see-also.js";
import RelatedItems from "./related-items/related-items.js";
import VideoBlock from "./related-items/video-block.js";
import Footer from "./footer/footer.js";
import Tool from "./core/tool.js";
import { getLinkData, getLinkSlugAndHash } from "./core/links-resolve.js";
import Logo from "./logo/logo.js";

let viz;

const App = async function({ DOCID_CMS, DOCID_I18N, DEFAULT_LOCALE = "en", theme } = {}) {

  const cmsData = await cmsService.load({ DOCID_CMS, DOCID_I18N, DEFAULT_LOCALE });
  const allowedTools = cmsData.toolset.filter(f => !!f.tool).map(m => m.id);

  let shortLinkState = {};
  const {slug: shortLinkSlug, hash: shortLinkHash} = await getLinkSlugAndHash(window.location.search);
  if (shortLinkSlug) {
    const linkData = await getLinkData(shortLinkSlug);
    if (linkData && linkData.page_config) shortLinkState = linkData.page_config;
  }

  const state = urlService.init({ allowedTools, defaultLocale: DEFAULT_LOCALE, shortLinkHash, shortLinkState });

  d3.select(".wrapper").classed("embedded-view", state.getEmbedded());


  const translator = await initTranslator(state, cmsData.properties?.locales);
  const tool = new Tool({ cmsData, state, dom: ".vizabi-placeholder" });

  const {applyTheme, getTheme} = new ThemeService(theme);
  applyTheme(".too-wrapper");

  new Logo({getTheme, state, dom: ".too-logo" });
  new ChartSwitcher({getTheme, translator, state, dom: ".too-chart-switcher", data: cmsData.toolset });
  new ChartSwitcherWithIcons({getTheme, translator, state, dom: ".too-chart-switcher-with-icons", data: cmsData.toolset });
  const message = new Message({ translator, state, dom: ".too-message" });
  new Menu({getTheme, translator, state, dom: ".too-menu",
    videoSrc: cmsData.properties?.HOWTO_VIDEO_LINK,
    data: cmsData.menu, menuButton: ".header .hamburger-button", mobileMenuContainer: ".too-mobile-menu" });
  new SocialButtons({getTheme, translator, state, dom: ".too-social-buttons",
    bitlyService: await BitlyService({ state }), locationService: LocationService() });
  new LanguageSwitcher({getTheme, translator, state, dom: ".too-language-button",
    data: cmsData.properties?.locales });

  new SeeAlso({getTheme,translator, state, dom: ".too-see-also", data: cmsData.toolset });
  new RelatedItems({getTheme, translator, state, dom: ".too-related-block", data: cmsData.related });
  new VideoBlock({getTheme, translator, state, dom: ".too-video-block" });
  new UserLogin({getTheme, translator, state, dom: ".too-login-button" });
  new Footer({getTheme, translator, state, dom: ".too-footer" });

  state.dispatch.on("authStateChange.app", (event) => {
    console.log(event);
    tool.setVizabiUserAuth();
    if (viz) state.setTool();
  });

  state.dispatch.on("toolChanged.app", ({ id, previousToolId }) => {
    tool.setTool({ id, previousToolId });
  });
  state.dispatch.on("toolStateChangeFromPage.app", state => {
    tool.setVizabiToolState(state);
  });
  state.dispatch.on("toolReset.app", () => {
    tool.setVizabiToolToDefaultConfig();
  });
  state.dispatch.on("languageChanged.app", async id => {
    tool.setVizabiLocale(id);
    await initTranslator();
    state.dispatch.call("translate", null, id);
  });
  state.dispatch.on("projectorChanged.app", truefalse => {
    tool.setVizabiProjector(truefalse);
  });
  state.dispatch.on("showMessage.app", ({ message: msg }) => message.showMessage(msg) );


  viz = await tool.setTool();
  return viz;
};

export default App;

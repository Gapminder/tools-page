import * as urlService from "./core/url.js";
import * as cmsService from "./core/cms.js";
import ThemeService from "./core/theme.js";

import { initTranslator } from "./core/language.js";

import BitlyService from "./core/bitly.service"; //TODO REFACTOR
import LocationService from "./core/location.service"; //TODO REFACTOR

import SocialButtons from "./social-buttons/social-buttons.js";
import LanguageSwitcher from "./language-switcher/language-switcher.js";
import ChartSwitcher from "./chart-switcher/chart-switcher.js";
import ChartSwitcherWithIcons from "./chart-switcher/chart-switcher-with-icons.js";
import UserLogin from "./auth/user-login.js";
import Menu from "./menu/menu.js";
import Howto from "./howto/howto.js";
import MobileMenu from "./menu/menu-mobile.js";
import Message from "./message/message.js";
import SeeAlso from "./see-also/see-also.js";
import RelatedItems from "./related-items/related-items.js";
import VideoBlock from "./related-items/video-block.js";
import Footer from "./footer/footer.js";
import Tool from "./core/tool.js";
import { getLinkData, getLinkSlugAndHash } from "./core/links-resolve.js";
import Logo from "./logo/logo.js";
import PreferentialConfigService from "./core/default-config.service.js";
import {getPageSlug}  from "./core/utilsForAssetPaths.js"; 

let viz;

const App = async function({ DOCID_CMS, DOCID_I18N, DEFAULT_LOCALE = "en", site } = {}) {

  const pageSlug = getPageSlug();
  const {cmsData, pageId, defaultLocale} = await cmsService.load({ DOCID_CMS, DOCID_I18N, DEFAULT_LOCALE, site, pageSlug });

  let shortLinkState = null;
  const {slug: shortLinkSlug, hash: shortLinkHash} = await getLinkSlugAndHash(window.location.search);
  if (shortLinkSlug) {
    const linkData = await getLinkData(shortLinkSlug);
    if (linkData && linkData.page_config) shortLinkState = linkData.page_config;
  }

  const state = urlService.init({ 
    allowedTools: cmsData.toolset.filter(f => !!f.tool).map(m => m.id), 
    defaultLocale, 
    conceptMapping: cmsData.concept_mapping, 
    entitysetMapping: cmsData.entityset_mapping, 
    shortLinkHash, 
    shortLinkState,
    pageSlug 
  });

  d3.select(".wrapper").classed("embedded-view", state.getEmbedded());

  const {translator, getLocaleName} = await initTranslator(state, cmsData.locales);
  const bitlyService = await BitlyService({ state });
  const locationService = LocationService();
  const tool = new Tool({ cmsData, state, dom: ".vizabi-placeholder", site, pageSlug });
  
  
  const {applyTheme, getTheme} = new ThemeService(cmsData);
  applyTheme(".too-wrapper");

  new Logo({
    getTheme, translator, state, dom: ".too-logo" 
  });
  new ChartSwitcher({
    getTheme, translator, state, dom: ".too-chart-switcher", data: cmsData.toolset 
  });
  new ChartSwitcherWithIcons({
    getTheme, translator, state, dom: ".too-chart-switcher-with-icons", data: cmsData.toolset 
  });
  new Menu({
    getTheme, translator, state, dom: ".too-menu", data: cmsData.menu_items 
  });
  new Howto({
    getTheme, translator, state, dom: ".too-howto", howtoDialogDom: ".too-howto-dialog"
  });
  new SocialButtons({
    getTheme, translator, state, dom: ".too-social-buttons", bitlyService, locationService
  });
  new LanguageSwitcher({
    getTheme, getLocaleName, state, dom: ".too-language-button", data: cmsData.locales 
  });
  new UserLogin({
    getTheme, translator, state, dom: ".too-login-button", loginFormsDom: ".too-login-forms"
  });
  new MobileMenu({
    getTheme, translator, state, dom: ".too-mobile-menu", menuButtonDom: ".hamburger-button"
  });
  new SeeAlso({
    getTheme, translator, state, dom: ".too-see-also", data: cmsData.toolset 
  });
  new RelatedItems({
    getTheme, translator, state, dom: ".too-related-block", data: cmsData.related 
  });
  new VideoBlock({
    getTheme, translator, state, dom: ".too-video-block" 
  });
  new Footer({
    getTheme, translator, state, dom: ".too-footer", data: {links: cmsData.footer_links, logos: cmsData.footer_logos}
  });
  const message = new Message({
    getTheme, translator, state, dom: ".too-message" 
  });
  const preferentialConfigService = await PreferentialConfigService({ state, site, pageSlug, pageId, defaultConfigs: cmsData.toolconfig });


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

  state.dispatch.on("setPreferentialConfig", () => {
    preferentialConfigService.setPreferentialConfig();
  })
  state.dispatch.on("restorePreferentialConfig", () => {
    preferentialConfigService.restorePreferentialConfig();
  })

  viz = await tool.setTool();
  return viz;
};

export default App;

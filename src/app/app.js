import * as urlService from "./core/url.js";
import * as cmsService from "./core/cms.js";
import { scrollTo, deepExtend } from "./core/utils";

import { initTranslator } from "./core/language.js";


import UserLogin from "./auth/user-login.js";
import Menu from "./header/menu/menu.js";
import Message from "./header/message/message.js";

// import menuItems from "./core/menu-items";
import BitlyService from "./core/bitly.service"; //TODO REFACTOR
import LocationService from "./core/location.service"; //TODO REFACTOR

import SocialButtons from "./header/social-buttons/social-buttons.js";
import LanguageSwitcher from "./header/language-switcher/language-switcher.js";
import ChartSwitcherWithIcons from "./header/chart-switcher/chart-switcher-with-icons.js";
import SeeAlso from "./see-also/see-also.js";
import RelatedItems from "./related-items/related-items.js";
import VideoBlock from "./related-items/video-block.js";
import Footer from "./footer/footer.js";
import Tool from "./core/tool.js";
import { getLinkData, getLinkSlugAndHash } from "./core/links-resolve.js";

let viz;

const App = async function({ DOCID_CMS, DOCID_I18N, DEFAULT_LOCALE = "en" } = {}) {

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

  new ChartSwitcherWithIcons({ translator, state, dom: ".header .app-chart-switcher",
    data: cmsData.toolset });
  new Menu({ translator, state, dom: ".header .menu",
    videoSrc: cmsData.properties?.HOWTO_VIDEO_LINK,
    data: cmsData.menu, menuButton: ".header .menu-icon", mobileMenuContainer: ".app-mobile-menu" });
  new LanguageSwitcher({ translator, state, dom: ".app-language-switcher",
    data: cmsData.properties?.locales });
  //new SeeAlso({translator, state, dom: ".app-see-also",
  //  data: cmsData.toolset });
  new RelatedItems({ translator, state, dom: ".app-related-items .related-block",
    data: cmsData.related });
  new VideoBlock({ dom: ".video-block", videoSrc: cmsData.properties?.DEMO_VIDEO_LINK });
  new SocialButtons({ translator, state, dom: ".social-list .app-social-buttons",
    bitlyService: await BitlyService({ state }), locationService: LocationService() });
  new Footer({ translator, state, dom: ".app-footer" });
  const message = new Message({ translator, state, dom: ".app-message" });
  new UserLogin({ translator, state, dom: ".app-user-login" });
  
  d3.select("a.logo").on("click", state.resetState);

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

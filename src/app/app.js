import * as urlService from "./core/url.js";
import * as cmsService from "./core/cms.js";
import { scrollTo, deepExtend } from "./core/utils";

import { initTranslator } from "./core/language.js";


import Menu from "./header/menu/menu.js";
import MenuMobile from "./header/menu-mobile/menu-mobile.js";
import Message from "./header/message/message.js";
import DataEditor from "./header/data-editor/data-editor.js";

// import menuItems from "./core/menu-items";
import BitlyService from "./core/bitly.service"; //TODO REFACTOR
import LocationService from "./core/location.service"; //TODO REFACTOR

import SocialButtons from "./header/social-buttons/social-buttons.js";
import LanguageSwitcher from "./header/language-switcher/language-switcher.js";
import ChartSwitcher from "./header/chart-switcher/chart-switcher.js";
import SeeAlso from "./see-also/see-also.js";
import RelatedItems from "./related-items/related-items.js";
import Footer from "./footer/footer.js";
import Tool from "./core/tool.js";

let viz;

const App = async function(settings) {

  const cmsData = await cmsService.load(settings);
  const allowedTools = cmsData.toolset.filter(f => !!f.tool).map(m => m.id);

  const state = urlService.init({ allowedTools, defaultLocale: settings.DEFAULT_LOCALE });
  
  d3.select(".wrapper").classed("embedded-view", state.getEmbedded());
  
    
  const translator = await initTranslator(state, cmsData.properties?.locales);
  const tool = new Tool({cmsData, state, dom: ".vizabi-placeholder"});
  
  new ChartSwitcher({translator, state, dom: ".header .app-chart-switcher", 
    data: cmsData.toolset });
  new LanguageSwitcher({translator, state, dom: ".header .app-language-switcher", 
    data: cmsData.properties?.locales});
  new SeeAlso({translator, state, dom: ".app-see-also", 
    data: cmsData.toolset });
  new RelatedItems({translator, state, dom: ".app-related-items", 
    data: cmsData.related });
  new SocialButtons({translator, state, dom: ".social-list .app-social-buttons", 
    bitlyService: BitlyService(), locationService: LocationService()});
  new Footer({translator, state, dom: ".app-footer" });
  new Message({translator, state, dom: ".app-message"});
  new DataEditor({translator, state, tool, viz, dom: ".header .data-editor"});
  new Menu({dom: ".header .app-menu", translator, state, data: cmsData.menu });
  new MenuMobile( d3.select(".header .menu-mobile"), translator, state.dispatch,{ menu: d3.select(".header") });

  state.dispatch.on("toolChanged.app", ({id, previousToolId}) => {
    tool.setTool({id, previousToolId});
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


  
  viz = await tool.setTool();
  return viz;
};

export default App;

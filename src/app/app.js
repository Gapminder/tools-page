import * as urlService from "./core/url.js";
import * as cmsService from "./core/cms.js";
import { initState, setState, getState, dispatch } from "./core/global.js";
import { scrollTo, deepExtend } from "./core/utils";

import { translator, initTranslator } from "./core/language.js";


// import LanguageSwitcher from "./header/language-switcher/language-switcher";
// import SocialButtons from "./header/social-buttons/social-buttons";
// import Menu from "./header/menu/menu";
// import MenuMobile from "./header/menu-mobile/menu-mobile";
// import Message from "./header/message/message";
// import DataEditor from "./header/data-editor/data-editor";

// import menuItems from "./core/menu-items";
// import BitlyService from "./core/bitly.service";
// import LocationService from "./core/location.service";
import ChartSwitcher from "./header/chart-switcher/chart-switcher.js";
import SeeAlso from "./see-also/see-also.js";
import RelatedItems from "./related-items/related-items.js";
import Footer from "./footer/footer.js";
import { setTool } from "./core/tool.js";


const App = async function() {

  const configs = await cmsService.load();
  const allowedTools = configs.toolset.filter(f => !!f.tool).map(m => m.id);

  const tool_id = urlService.init({ allowedTools });
  initState({ configs, tool: tool_id, urlService });
  initTranslator(configs["page/en"]);

  d3.select(".wrapper").classed("embedded-view", getState("embedded"));

  new SeeAlso({ dom: ".app-see-also", translator, dispatch, data: configs.toolset });
  new RelatedItems({ dom: ".app-related-items", translator, dispatch, data: configs.related, switchTool });
  new Footer({ dom: ".app-footer", translator, dispatch });

  new ChartSwitcher({ dom: ".header .app-chart-switcher", translator, dispatch, data: configs.toolset, switchTool });

  function switchTool(id) {
    if (getState("tool") === id) {
      //switch to same tool: reset state, discard chart transition
      urlService.resetURL();
    } else {
      setTool(id, configs);
    }
    dispatch.call("toolChanged", null, id);
  }

  setTool(null, configs)


  dispatch.on("toolChanged.app", id => {
    window.history.pushState({
      tool: id,
      model: {}
    }, "Title", `#$chart-type=${id}`);
  });


  return;
  new Message({ dom: ".app-message", translator, dispatch });
  new Tool({ dom: ".app-tool", translator, dispatch });

  new DataEditor({ dom: ".header .data-editor", translator, dispatch });

  new LanguageSwitcher(
    d3.select(".header .app-language-switcher"),
    translator,
    dispatch,
    {
      languages: getLanguages(),
      selectedLanguage: appState.language,
      onClick: d => setLanguage(d.key)
    });


  new Menu(
    d3.select(".header .app-menu"),
    translator,
    dispatch,
    {
      menuItems: menuItems.children
    });

  new MenuMobile(
    d3.select(".header .menu-mobile"),
    translator,
    dispatch,
    {
      menu: d3.select(".header")
    });


  new SocialButtons(
    d3.select(".social-list .app-social-buttons"),
    translator,
    appState,
    dispatch,
    {
      bitlyService: BitlyService(),
      locationService: LocationService(),
    });


  setLanguage(appState.language);
};

export default App;

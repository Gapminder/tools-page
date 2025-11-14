
import { getFileReaderForVizabi } from "./language.js";
import { getTransitionModel } from "./chart-transition.js";
import { deepExtend, diffObject, removeProperties } from "./utils.js";
import { loadConfigModule, resolveAssetUrl } from "./utilsForAssetPaths.js";
import timeLogger from "./timelogger.js";
import { loadTool } from "../../../vizabi-tools.js";

const {observable, toJS, autorun} = mobx;

let viz;
let urlUpdateDisposer;
const disposers = [];
const PLACEHOLDER = ".vzb-placeholder";

const Tool = function({ cmsData, state, dom }) {
  const { toolset, datasources, toolconfig } = cmsData;


  // apply data models from configuration to target
  function applyDataConfigFromUrlStateToTarget(toolsetEntry, urlState, authToken, permalinkToken, target) {
    if (!target.model.dataSources) target.model.dataSources = {};
    const urlDataConfig = urlState.model?.dataSources;

    if (urlDataConfig) {
      target.model.dataSources = urlDataConfig;
    } else {
      //bring data configs from a separate config file to the page config (those mentioned in toolset)

      const dataSourcesId = toolsetEntry.dataSources || Object.keys(datasources);
      dataSourcesId.forEach(ds => {
        if (!datasources[ds]) {
          console.warn(`Could not find data config with key ${ds} in datasources file`);
        } else {
          target.model.dataSources[ds] = datasources[ds];
        }
        target.model.dataSources[ds].locale = urlState?.ui?.locale || target.ui?.locale;
        target.model.dataSources[ds].authToken = authToken;
        target.model.dataSources[ds].permalinkToken = permalinkToken;
      });
    }

    //check if marker datasource is no longer among the configured datasources and kill marker config in that case
    //TODO: go deeper in encoding config and make it more granular
    const markerId = toolsetEntry.mainMarker;
    const datasourceIDs = Object.keys(target.model.dataSources);
    if (!datasourceIDs.includes(target.model.markers[markerId]?.data?.source))
      target.model.markers = { [markerId]: { data: { source: datasourceIDs[0] } } };

    return target;
  }


  async function setTool({ id, previousToolId, skipTransition = true } = {}) {

    //init gtag if (gtag) gtag("config", poduction ...
    const tool = id || state.getTool();

    const toolsetEntry = toolset.find(f => f.id === tool);
    const toolsetEntryPrevious = toolset.find(f => f.id === state.getTool());

    cleanupPreviousTool();

    timeLogger.removeAll();
    timeLogger.add("SPLASH");
    timeLogger.add("FULL");

    //LAZY-LOAD TOOLS JS CODE
    const toolsToLoad = [toolsetEntry.tool].concat(toolsetEntry.toolComponents || []);
    const toolsLoaded = await Promise.all(toolsToLoad.map(
      tool => window[tool]
        ? Promise.resolve()
        : loadTool(tool.toLowerCase(), resolveAssetUrl).then(prototype => window[tool] = prototype)
    ));

    const pathToConfig = `config/toolconfigs/${toolsetEntry.config || toolsetEntry.tool}.js`
      .replace(/\.js\.js$/, '.js'); // Fix a possible mistake of double .js extension
    const VIZABI_MODEL = await loadConfigModule(pathToConfig);

    d3.select(".vizabi-placeholder")
      .append("div")
      .attr("class", "vzb-placeholder")
      .attr("style", "width: 100%; height: 100%;");

    function applyTransitionConfigs(pageConfig) {
      if (skipTransition || !viz) return pageConfig;
      const toolModelPrevious = {}; //TODO: viz ? viz.getPersistentMinimalModel(VIZABI PAGE MODEL PREVIOUS) : {};
      const transitionModel = getTransitionModel(toolModelPrevious, toolsetEntryPrevious.transition, toolsetEntry.transition);
      return deepExtend({}, pageConfig, transitionModel, true); //true --> overwrite by empty
    }


    const pageBaseConfig = deepExtend({
      ui: {
        layout: deepExtend({}, VizabiSharedComponents.LayoutService.DEFAULTS, {
          placeholder: PLACEHOLDER
        }),
        locale: deepExtend({}, VizabiSharedComponents.LocaleService.DEFAULTS, {
          placeholder: PLACEHOLDER,
          path: resolveAssetUrl("assets/translation/"),
          getExternalFileReader: getFileReaderForVizabi
        })
      },
      model: { markers: { [toolsetEntry.mainMarker]: { data: { source: toolsetEntry.dataSources[0] } } } }
    }, VIZABI_MODEL /* add config from file */, toolconfig.preferential.get(tool) || toolconfig.essential.get(tool) || {} /* add config from cms */);

    let vizabiStartConfig = deepExtend({}, pageBaseConfig);

    if (previousToolId) vizabiStartConfig = applyTransitionConfigs(vizabiStartConfig);

    //apply URL configs
    vizabiStartConfig = applyDataConfigFromUrlStateToTarget(toolsetEntry, state.getURLI(), state.getAuthToken(), state.getPermalinkToken(), vizabiStartConfig);
    VizabiSharedComponents.Utils.mergeInTarget(vizabiStartConfig, state.getURLI(), /*treat as blocks:*/ ["data.filter"]);

    const VIZABI_UI_CONFIG = observable(vizabiStartConfig.ui);
    const VIZABI_LOCALE = observable(vizabiStartConfig.ui.locale);
    const VIZABI_LAYOUT = observable(vizabiStartConfig.ui.layout);

    const ToolPrototype =  toolsetEntry.toolVariation ? window[toolsetEntry.tool][toolsetEntry.toolVariation] : window[toolsetEntry.tool];
    viz = new ToolPrototype({
      Vizabi,
      placeholder: PLACEHOLDER,
      model: Vizabi(vizabiStartConfig.model),
      locale: VIZABI_LOCALE,
      layout: VIZABI_LAYOUT,
      ui: VIZABI_UI_CONFIG,
      default_ui: pageBaseConfig.ui,
      options: {
        showLoading: true,
        toolComponents: toolsetEntry.toolComponents ? toolsetEntry.toolComponents.map(toolComponent => window[toolComponent].Base) : undefined
      }
    });

    const urlInitConfig = diffObject(vizabiStartConfig, pageBaseConfig);

    //component config + tool config + pageBaseConfig
    const combinedDefaultConfig = deepExtend({}, diffObject({
      model: toJS(viz.model.config, { recurseEverything: true }),
      ui: viz.DEFAULT_UI
    }, vizabiStartConfig), pageBaseConfig);

    //console.log({combinedDefaultConfig, urlInitConfig})


    const switchDataSourceIfConceptNotFound = mobx.autorun(() => {
      //needed for the old URLs to work when switching to a different default data source
      if (viz.status === "fulfilled") {
        for (const marker in viz.model.markers) {
          if (marker !== toolsetEntry.mainMarker) continue;
          for (const enc in viz.model.markers[marker].encoding) {
            const dataconfig = viz.model.markers[marker].encoding[enc].data;

            const hasConcept = (ds, c) => ds.getConcept(c).concept;

            const concept = dataconfig.config.concept;
            if (concept && typeof concept === "string" && !hasConcept(dataconfig.source, concept)) {
              const dataSource = Vizabi.stores.dataSources.getAll().find(ds => hasConcept(ds, concept));
              if (dataSource?.id) dataconfig.config.source = dataSource.id;
            }
          }
        }
      }
    });
    disposers.push(switchDataSourceIfConceptNotFound);

    const checkDataSourcesAuth = mobx.autorun(() => {
      const dataSources = viz.model.dataSources;
      const dsArray = Object.values(dataSources);
      if (dsArray.map(ds => ds.state).every(s => s == "fulfilled")) {
        const messages = [];
        dsArray.forEach(ds => {
          if (ds.responseError && ds.responseError.code == "HTTP_401" && ds.responseError.message == "Unauthorized") {
            messages.push(`You are unable to access to private data source ${ds.config.dataset}. Please login for resolve.`);
          }
          if (messages.length) state.dispatch.call("showMessage", null, { message: messages.join("\n")});
        });
      }
    });
    disposers.push(checkDataSourcesAuth);
    
    //googleAnalyticsLoadEvents(viz, toolsetEntry);


    urlUpdateDisposer = autorun(() => {
      const Utils = VizabiSharedComponents.Utils;

      const currentConfig = {
        model: toJS(viz.model.config, { recurseEverything: true }),
        ui: toJS(VIZABI_UI_CONFIG, { recurseEverything: true })
      };

      const meaningfulDeltaConfig = Utils.clearEmpties(
        removeProperties(
          diffObject(currentConfig, combinedDefaultConfig),
          ["highlighted", "superhighlighted", "range", "frame.scale.domain", "presets", "dragging", "opened", "dataSources"]
        )
      );

      state.updateURL({ model: meaningfulDeltaConfig.model, ui: meaningfulDeltaConfig.ui, tool, replaceInsteadPush: true });

    }, { name: "tool.js: update url" });

    window.viz = viz;
    return viz;
  }

  function setVizabiToolState({ model = {}, ui = {} } = {}) {
    //viz.setModel(poppedModel);
    runInAction(() => {
      VizabiSharedComponents.Utils.replaceProps(VIZABI_UI_CONFIG, ui);
      VizabiSharedComponents.Utils.mergeInTarget(viz.model.config, model);
    });
  }

  function setVizabiUserAuth(){
    if(!viz?.model?.dataSources) return;
    const dataSources = Object.values(viz.model.dataSources);
    const token = state.getAuthToken();
    dataSources.forEach(ds => {
      if(ds.reader.setAuthToken) ds.reader.setAuthToken(token);
    });
  }

  function setVizabiLocale(id) {
    if (viz?.services?.locale) viz.services.locale.id = id;
    if (viz?.ui?.locale) viz.ui.locale.id = id;
  }

  function setVizabiProjector(truefalse) {
    if (viz?.services?.layout) viz.services.layout.projector = truefalse;
    if (viz?.ui?.layout) viz.ui.layout.projector = truefalse;
  }

  //cleanup the existing tool
  function cleanupPreviousTool() {
    //kill the autorun reactions from the old tool
    if (urlUpdateDisposer) urlUpdateDisposer();
    if (viz) {
      viz.deconstruct();
      viz = void 0;
      let dispose;
      while (dispose = disposers.pop()) {
        dispose();
      }
      Vizabi.stores.markers.disposeAll();
    }
    d3.selectAll(".vzb-tool-config")
      .remove();
    d3.select(".vzb-placeholder")
      .remove();
  }

  return { setTool, setVizabiToolState, setVizabiLocale, setVizabiProjector, setVizabiUserAuth };
};
export default Tool;

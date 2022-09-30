const {
  BaseComponent,
  TimeSlider,
  DataNotes,
  DataWarning,
  ErrorMessage,
  SpaceConfig,
  LocaleService,
  LayoutService,
  CapitalVizabiService,
  TreeMenu,
  SteppedSlider,
  Dialogs,
  ButtonList,
  Repeater,
  versionInfo
} = VizabiSharedComponents;

window.Combo = class Combo extends BaseComponent {

  constructor(config){
    
    const markerName = config.options?.markerNames?.bubble || "bubble";
    const fullMarker = config.model.markers[markerName];
    config.Vizabi.utils.applyDefaults(fullMarker.config, BubbleChart.DEFAULT_CORE(markerName));   
    
    const frameType = config.Vizabi.stores.encodings.modelTypes.frame;
    const { marker, splashMarker } = frameType.splashMarker(fullMarker);
    
    config.model.markers[markerName] = marker;

    config.name = "combo";

    config.subcomponents = [{
      type: BubbleChart.mainComponent,
      placeholder: ".vzb-bubblechart",
      model: marker,
      name: "chart"
    },{
      type: ExtApiMap.mainComponent,
      placeholder: ".vzb-extapimap",
      model: marker,
      name: "chart"
    },{
      type: TimeSlider,
      placeholder: ".vzb-timeslider",
      model: marker,
      name: "time-slider"
    },{
      type: SteppedSlider,
      placeholder: ".vzb-speedslider",
      model: marker,
      name: "speed-slider"
    },{
      type: TreeMenu,
      placeholder: ".vzb-treemenu",
      model: marker,
      name: "tree-menu"
    },{
      type: DataWarning,
      placeholder: ".vzb-datawarning",
      options: {button: ".vzb-datawarning-button"},
      model: marker,
      name: "data-warning"
    },{
      type: DataNotes,
      placeholder: ".vzb-datanotes",
      model: marker
    },{
      type: Dialogs,
      placeholder: ".vzb-dialogs",
      model: marker,
      name: "dialogs"
    },{
      type: ButtonList,
      placeholder: ".vzb-buttonlist",
      model: marker,
      name: "buttons"
    },{
      type: SpaceConfig,
      placeholder: ".vzb-spaceconfig",
      options: {button: ".vzb-spaceconfig-button"},
      model: marker,
      name: "space-config"
    },{
      type: ErrorMessage,
      placeholder: ".vzb-errormessage",
      model: marker,
      name: "error-message"
    }];

    config.template = `
    <div class="vzb-tool-combo vzb-split-vertical">
      <div class="vzb-chart-combo vzb-bubblechart"></div>
      <div class="vzb-chart-combo vzb-extapimap"></div>
    </div>
    <div class="vzb-animationcontrols">
      <div class="vzb-timeslider"></div>
      <div class="vzb-speedslider"></div>
    </div>
    <div class="vzb-sidebar">
      <div class="vzb-dialogs"></div>
      <div class="vzb-buttonlist"></div>
    </div>
    <div class="vzb-treemenu"></div>
    <div class="vzb-datawarning"></div>
    <div class="vzb-spaceconfig"></div>
    <div class="vzb-datanotes"></div>
    <div class="vzb-errormessage"></div>
    `;

    config.services = {
      Vizabi: new CapitalVizabiService({Vizabi: config.Vizabi}),
      locale: new LocaleService(config.locale),
      layout: new LayoutService(config.layout)
    };

    super(config);

    this.splashMarker = splashMarker;
  }
}
Combo.DEFAULT_UI = {
  chart: {  
  },
};




  // //provide the default options
  // default_model: {
  //   state: {
  //     time: {},
  //     entities: {},
  //     entities_colorlegend: {},
  //     marker: {
  //       space: ["entities", "time"],
  //       axis_x: {},
  //       axis_y: {},
  //       label: {},
  //       size: {},
  //       color: {},
  //       size_label: {
  //         use: "constant",
  //         which: "_default",
  //         scaleType: "ordinal",
  //         _important: false,
  //         extent: [0, 0.33],
  //         allow: {
  //           names: ["_default"]
  //         }
  //       },
  //     },
  //     "marker_colorlegend": {
  //       "space": ["entities_colorlegend"],
  //       "label": {
  //         "use": "property",
  //         "which": "name"
  //       },
  //       "hook_rank": {
  //         "use": "property",
  //         "which": "rank"
  //       },
  //       "hook_geoshape": {
  //         "use": "property",
  //         "which": "shape_lores_svg"
  //       }
  //     }
  //   },
  //   locale: {},
  //   ui: {
  //     chart: {
  //       decorations: {},
  //       superhighlightOnMinimapHover: true,
  //       whenHovering: {
  //         showProjectionLineX: true,
  //         showProjectionLineY: true,
  //         higlightValueX: true,
  //         higlightValueY: true
  //       },
  //       labels: {
  //         dragging: true,
  //         removeLabelBox: false
  //       },
  //       margin: {
  //         left: 0,
  //         top: 0
  //       },
  //       trails: false,
  //       lockNonSelected: 0
  //     },
  //     presentation: false,
  //     panWithArrow: true,
  //     adaptMinMaxZoom: false,
  //     cursorMode: "arrow",
  //     zoomOnScrolling: true,
  //     buttons: ["colors", "find", "trails", "lock", "moreoptions", "fullscreen", "presentation"],
  //     dialogs: {
  //       popup: ["colors", "find", "size", "zoom", "moreoptions"],
  //       sidebar: ["colors", "find", "size", "zoom"],
  //       moreoptions: ["opacity", "speed", "axes", "size", "colors", "label", "zoom", "presentation", "about"]
  //     }
  //   }
  // }




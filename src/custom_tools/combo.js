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
  LegacyUtils,
  versionInfo
} = VizabiSharedComponents;

const SPLIT_DIRECTION_ICON = `
  <svg class="vzb-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="511.261px" height="511.261px" viewBox="0 0 511.261 511.261" style="enable-background:new 0 0 511.261 511.261;" xml:space="preserve">
    <g>
      <path d="M430.25,379.655l-75.982-43.869v59.771H120.73V151.966h59.774l-43.869-75.983L92.767,0L48.898,75.983L5.029,151.966h59.775v271.557c0,15.443,12.52,27.965,27.963,27.965h261.5v59.773l75.982-43.869l75.982-43.867L430.25,379.655z"/>
    </g>
  </svg>`;


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
      <div class="vzb-split-line"></div>
      <div class="vzb-split-direction-button"></div>
      <div class="vzb-split-overlay vzb-hidden"></div>
      <div class="vzb-split-line vzb-split-line-drag vzb-hidden"></div>
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

  setup(options) {
    this.DOM = {
      comboTool: this.element.select(".vzb-tool-combo"),
      splitDirectionButton: this.element.select(".vzb-split-direction-button"),
      splitOverlay: this.element.select(".vzb-split-overlay"),
      splitLine: this.element.select(".vzb-split-line"),
      splitLineDrag: this.element.select(".vzb-split-line-drag")
    }

    LegacyUtils.setIcon(this.DOM.splitDirectionButton, SPLIT_DIRECTION_ICON);

    const _this = this;
    this.DOM.splitLine.datum({});
    this.DOM.splitLine.call(
      d3.drag()
        .on("start", (event, d) => {
          if (_this.root.ui.chart.splitVertical) {
            d.xMin = 15;
            d.xMax = _this.toolWidth - 15;
            _this.DOM.splitLineDrag.attr("style", `transform: translateX(${event.x}px)`)
          } else {
            d.yMin = 15;
            d.yMax = _this.toolHeight - 15;
            _this.DOM.splitLineDrag.attr("style", `transform: translateY(${event.y}px)`)
          }
          _this.DOM.splitOverlay.classed("vzb-hidden", false);
          _this.DOM.splitLineDrag.classed("vzb-hidden", false);
        })
        .on("drag", (event, d) => {
          if (_this.root.ui.chart.splitVertical) {
            d._x = event.x < d.xMin ? d.xMin : event.x > d.xMax ? d.xMax : event.x;
            _this.DOM.splitLineDrag.attr("style", `transform: translateX(${d._x}px)`)
          } else {
            d._y = event.y < d.yMin ? d.yMin : event.y > d.yMax ? d.yMax : event.y;
            _this.DOM.splitLineDrag.attr("style", `transform: translateY(${d._y}px)`)
          }
        })
        .on("end", () => {
          _this.DOM.splitOverlay.classed("vzb-hidden", true);
          _this.DOM.splitLineDrag.classed("vzb-hidden", true);
          _this.DOM.splitLineDrag.attr("style", null);
        })
        .on("end.update", (event, d) => {
          if (_this.root.ui.chart.splitVertical) {
            _this.root.ui.chart.splitRatio = +((d._x / _this.toolWidth).toFixed(2));
          } else {
            _this.root.ui.chart.splitRatio = +((d._y / _this.toolHeight).toFixed(2));
          }
        })
    );
    this.DOM.splitDirectionButton.on("click", () => {
      this.root.ui.chart.splitVertical = !this.root.ui.chart.splitVertical;
      this.root.ui.chart.splitRatio = 0.5;
    });

  }

  changeSplitDirection() {
    const splitDirectionClasses = ["vzb-split-horizontal", "vzb-split-vertical"];
    const classArray = this.root.ui.chart.splitVertical ? splitDirectionClasses : splitDirectionClasses.reverse();
    this.DOM.comboTool.classed(classArray[0], false);
    this.DOM.comboTool.classed(classArray[1], true);    
    this.services.layout._resizeHandler();
  }

  changeSplitRatio() {
    const ratio = this.root.ui.chart.splitRatio;
    
    if (this.root.ui.chart.splitVertical) {
      this.DOM.comboTool.attr("style", `grid-template-columns: ${ratio}fr auto`);
    } else {
      this.DOM.comboTool.attr("style", `grid-template-rows: ${ratio}fr auto`);
    }
    this.services.layout._resizeHandler();
  }

  resize() {
    this.services.layout.size;

    this.toolHeight = (this.DOM.comboTool.node().clientHeight) || 0;
    this.toolWidth = (this.DOM.comboTool.node().clientWidth) || 0;    
  }

  draw() {
    this.addReaction(this.changeSplitDirection);
    this.addReaction(this.resize);
    this.addReaction(this.changeSplitRatio);
  }

}
Combo.DEFAULT_UI = {
  chart: {
    splitVertical: false,
    splitRatio: 0.5
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




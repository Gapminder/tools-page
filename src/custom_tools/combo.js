import { 
    BaseComponent,
    TimeSlider,
    DataNotes,
    DataWarning,
    LocaleService,
    LayoutService,
    TreeMenu,
    SteppedSlider,
    Dialogs,
    ButtonList
  } from "VizabiSharedComponents";

import { VizabiExtApiMap } from "vizabi-extapimap";

export default class Combo extends BaseComponent {
  constructor(config){
    const marker = config.model.stores.markers.get("bubble");

    config.name = "extapimap";

    config.subcomponents = [{
      type: VizabiExtApiMap,
      placeholder: ".vzb-extapimap",
      model: marker,
      name: "chart"
    },{
      type: TimeSlider,
      placeholder: ".vzb-timeslider",
      name: "time-slider",
      model: marker
    },{
      type: SteppedSlider,
      placeholder: ".vzb-speedslider",
      name: "speed-slider",
      model: marker
    },{
      type: TreeMenu,
      placeholder: ".vzb-treemenu",
      name: "tree-menu",
      model: marker
    },{
      type: DataNotes,
      placeholder: ".vzb-datanotes",
      model: marker
    },{
      type: DataWarning,
      placeholder: ".vzb-datawarning",
      name: "datawarning",
      model: marker
    },{
      type: Dialogs,
      placeholder: ".vzb-dialogs",
      model: marker,
      name: "dialogs"
    },{
      type: ButtonList,
      placeholder: ".vzb-buttonlist",
      name: "buttons",
      model: marker
    }];

    config.template = `
    <div class="vzb-extapimap"></div>
    <div class="vzb-animationcontrols">
      <div class="vzb-timeslider"></div>
      <div class="vzb-speedslider"></div>
    </div>
    <div class="vzb-sidebar">
      <div class="vzb-dialogs"></div>
      <div class="vzb-buttonlist"></div>
    </div>
    <div class="vzb-treemenu"></div>
    <div class="vzb-datanotes"></div>    
    <div class="vzb-datawarning"></div>
  `;

    config.services = {
      locale: new LocaleService(config.locale),
      layout: new LayoutService({placeholder: config.placeholder})
    };

    //register locale service in the marker model
    config.model.config.markers.bubble.data.locale = observable({
        get id() { return config.services.locale.id; }
      });

    super(config);
  } 
}







/*
Vizabi.Tool.extend('combo', {

    init: function(placeholder, external_model) {
  
      this.name = "combo";
  
      this.template =
        '<div class="vzb-tool vzb-tool-' + this.name + ' vzb-split-vertical">' +
        '<div class="vzb-tool-stage">' +
        '<div class="vzb-tool-viz vzb-tool-viz-bubble"></div>' +
        '<div class="vzb-tool-viz vzb-tool-viz-map"></div>' +
        '<div class="vzb-tool-time-speed-sliders">' +
        '<div class="vzb-tool-timeslider"></div>' +
        '<div class="vzb-tool-stepped-speed-slider"></div>' +
        '</div>' +
        '</div>' +
        '<div class="vzb-tool-sidebar">' +
        '<div class="vzb-tool-dialogs"></div>' +
        '<div class="vzb-tool-buttonlist"></div>' +
        '</div>' +
        '<div class="vzb-tool-treemenu vzb-hidden"></div>' +
        '<div class="vzb-tool-labels vzb-hidden"></div>' +
        '</div>';
  
      this.components = this.components = [{
        component: Vizabi.Component.get("bubblechart"),
        placeholder: ".vzb-tool-viz-bubble",
        model: ["state.time", "state.marker", "locale", "ui"]
      }, {
        component: Vizabi.Component.get("extapimap"),
        placeholder: ".vzb-tool-viz-map",
        model: ["state.time", "state.marker", "locale", "ui", "data"]
      }, {
        component: Vizabi.Component.get("timeslider"),
        placeholder: ".vzb-tool-timeslider",
        model: ["state.time", "state.marker", "ui"]
      }, {
        component: Vizabi.Component.get("dialogs"),
        placeholder: ".vzb-tool-dialogs",
        model: ["state", "ui", "locale"]
      }, {
        component: Vizabi.Component.get("buttonlist"),
        placeholder: ".vzb-tool-buttonlist",
        model: ["state", "ui", "locale"]
      }, {
        component: Vizabi.Component.get("treemenu"),
        placeholder: ".vzb-tool-treemenu",
        model: ["state.marker", "state.time", "locale", "ui"]
      }];
  
      this._super(placeholder, external_model);
    },
  
    //provide the default options
    default_model: {
      state: {
        time: {},
        entities: {},
        entities_colorlegend: {},
        marker: {
          space: ["entities", "time"],
          axis_x: {},
          axis_y: {},
          label: {},
          size: {},
          color: {},
          size_label: {
            use: "constant",
            which: "_default",
            scaleType: "ordinal",
            _important: false,
            extent: [0, 0.33],
            allow: {
              names: ["_default"]
            }
          },
        },
        "marker_colorlegend": {
          "space": ["entities_colorlegend"],
          "label": {
            "use": "property",
            "which": "name"
          },
          "hook_rank": {
            "use": "property",
            "which": "rank"
          },
          "hook_geoshape": {
            "use": "property",
            "which": "shape_lores_svg"
          }
        }
      },
      locale: {},
      ui: {
        chart: {
          decorations: {},
          superhighlightOnMinimapHover: true,
          whenHovering: {
            showProjectionLineX: true,
            showProjectionLineY: true,
            higlightValueX: true,
            higlightValueY: true
          },
          labels: {
            dragging: true,
            removeLabelBox: false
          },
          margin: {
            left: 0,
            top: 0
          },
          trails: false,
          lockNonSelected: 0
        },
        presentation: false,
        panWithArrow: true,
        adaptMinMaxZoom: false,
        cursorMode: "arrow",
        zoomOnScrolling: true,
        buttons: ["colors", "find", "trails", "lock", "moreoptions", "fullscreen", "presentation"],
        dialogs: {
          popup: ["colors", "find", "size", "zoom", "moreoptions"],
          sidebar: ["colors", "find", "size", "zoom"],
          moreoptions: ["opacity", "speed", "axes", "size", "colors", "label", "zoom", "presentation", "about"]
        }
      }
    }
  
  
  
  
  });
  */

export const VIZABI_MODEL = {
  model: {
    markers: {
      bubble: {
        requiredEncodings: ["x", "y", "size"],
        // requiredEncodings: ["x", "y", "x_total", "y_total", "size"],
        data: {
          space: ["geo", "time"],
          source: "co2emissions",
          // filter: {
          //   //dimensions: { "geo": { "$or": [{ "un_state": true }] } }
          // }
        },
        encoding: {
          "show": {
            modelType: "selection",
            data: {
              filter: { dimensions: { "geo": { "$not": { "is--country": 1, "un_state": 0 } } } }
            }
          },
          "selected": {
            modelType: "selection",
            data: {
              filter: {
                ref: "markers.bubble.encoding.trail.data.filter"
              }
            }
          },
          "highlighted": {
            modelType: "selection"
          },
          "superhighlighted": {
            modelType: "selection"
          },
          "order": {
            modelType: "order",
            direction: "desc",
            data: {
              ref: "markers.bubble.config.encoding.size.data"
            }
          },
          "size": {
            data: {
              concept: "total_co2",
            },
            scale: {
              modelType: "size",
              domain: [0, 10628351002],
              zoomed: [0, 10628351002],
              extent: [0, 1]
            }
          },
          "y": {
            data: {
              concept: "co2e_per_cap",
            },
            scale: {
              domain: [0, 150],
              zoomed: [0, 60]
            }
          },
          "x": {
            data: {
              concept: "mean_income"
            },
            scale: {
              type: "log",
              domain: [0.2, 450],
              zoomed: [0.2, 450]
            }
          },
          "y_total": {
            modelType: "lane",
            scale: {
              allowedTypes: ["linear", "log", "genericLog", "pow", "time", "rank"]
            },
            data: {
              space: ["geo", "time"],
              concept: { ref: "markers.bubble.encoding.y.data.concept" },
              source: { ref: "markers.bubble.encoding.y.data.source" }
            }
          },
          "x_total": {
            scale: {
              allowedTypes: ["linear", "log", "genericLog", "pow", "time"]
            },
            data: {
              space: ["geo", "time"],
              concept: { ref: "markers.bubble.encoding.x.data.concept" },
              source: { ref: "markers.bubble.encoding.x.data.source" }
            }
          },
          "size_total": {
            data: {
              space: ["geo", "time"],
              concept: { ref: "markers.bubble.encoding.size.data.concept" },
              source: { ref: "markers.bubble.encoding.size.data.source" }
            },
            scale: {
              modelType: "size",
              allowedTypes: ["linear", "log", "genericLog", "pow", "point"]
            }
          },
          "color": {
            data: {
              source: "fasttrack",
              space: ["geo"],
              concept: "world_4region"
            },
            scale: {
              modelType: "color",
              type: "ordinal"
            }
          },
          "label": {
            data: {
              modelType: "entityPropertyDataConfig",
              concept: "name"
            }
          },
          "size_label": {
            data: {
              constant: "_default"
            },
            scale: {
              modelType: "size",
              extent: [0, 0.34]
            }
          },
          frame: {
            modelType: "frame",
            speed: 200,
            value: "2022",
            splash: true,
            data: {
              concept: "time"
            }
          },
          "trail": {
            modelType: "trail",
            groupDim: "time",
            show: true
          },
          "repeat": {
            modelType: "repeat",
            useConnectedRowsAndColumns: true,
            row: ["y"],
            column: ["x"],
            allowEnc: ["y", "x"]
          }
        }
      },
      "legend": {
        data: {
          ref: {
            transform: "entityConceptSkipFilter",
            path: "markers.bubble.encoding.color"
          }
        },
        encoding: {
          color: {
            data: {
              concept: { ref: "markers.bubble.encoding.color.data.concept" },
              constant: { ref: "markers.bubble.encoding.color.data.constant" }
            },
            scale: {
              modelType: "color",
              palette: { ref: "markers.bubble.encoding.color.scale.palette" },
              domain: null,
              range: null,
              type: null,
              zoomed: null,
              zeroBaseline: false,
              clamp: false,
              allowedTypes: null
            }
            //scale: { ref: "markers.bubble.encoding.color.scale" }
          },
          name: { data: { concept: "name" } },
          order: {
            modelType: "order",
            direction: "asc",
            data: { concept: "rank" }
          },
          map: { data: { concept: "shape_lores_svg" } }
        }
      },
    }
  },
  ui: {
    locale: { id: "en", shortNumberFormat: true },
    layout: { projector: false },

    //ui
    "buttons": {
      "buttons": ["colors", "markercontrols", "skateramp-story", "trails", "moreoptions", "presentation", "sidebarcollapse", "fullscreen"]
    },
    "dialogs": {
      "dialogs": {
        "popup": ["colors", "markercontrols", "skateramp-story", "moreoptions"],
        "sidebar": ["colors", "skateramp-story", "size", "zoom"],
        "moreoptions": [
          "opacity",
          "speed",
          "axes",
          "size",
          "colors",
          "label",
          "zoom",
          "technical",
          "repeat",
          "presentation",
          "about"
        ]
      },
      "markercontrols": {
        "primaryDim": "geo"
      }
    },


    "chart": {
      show_ticks: true,
      showForecast: false,
      showForecastOverlay: true,
      pauseBeforeForecast: true,
      endBeforeForecast: "2022",
      opacityHighlight: 1.0,
      opacitySelect: 1.0,
      opacityHighlightDim: 0.1,
      opacitySelectDim: 0.3,
      opacityRegular: 0.8,
      timeInBackground: true,
      timeInTrails: true,
      lockNonSelected: 0,
      panWithArrow: false,
      adaptMinMaxZoom: false,
      cursorMode: "arrow",
      zoomOnScrolling: false,
      superhighlightOnMinimapHover: true,
      whenHovering: {
        showProjectionLineX: true,
        showProjectionLineY: true,
        higlightValueX: true,
        higlightValueY: true
      },
      labels: {
        enabled: true,
        dragging: true,
        removeLabelBox: false
      },
      margin: {
        left: 0,
        top: 0
      },
      decorations: {
        "enabled": true,
        "xAxisGroups": {
          "gdp_pcap": [
            { "min": null, "max": 2650, "label": "incomegroups/level1", "label_short": "incomegroups/level1short" },
            { "min": 2650, "max": 8000, "label": "incomegroups/level2", "label_short": "incomegroups/level2short" },
            { "min": 8000, "max": 24200, "label": "incomegroups/level3", "label_short": "incomegroups/level3short" },
            { "min": 24200, "max": null, "label": "incomegroups/level4", "label_short": "incomegroups/level4short" }
          ]
        }
      }
    },
    "data-warning": {
      doubtDomain: [1800, 1950, 2015],
      doubtRange: [0, 0, 0]
    },
    "tree-menu": {
      "showDataSources": false,
      "folderStrategyByDataset": {
        "sg": "spread",
        "fasttrack": "spread",
        "country_flags": "spread",
        "wdi": "folder:other_datasets",
        "co2emissions": "folder:other_datasets",
        "u5deaths": "folder:other_datasets"
      }
    }
  }
};

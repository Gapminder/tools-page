export const VIZABI_MODEL = {
  model: {
    markers: {
      bubble: {
        requiredEncodings: ["x", "y", "lat", "lon", "size"],
        data: {
          locale: "en",
          source: "sg",
          space: ["geo", "time"],
          filter: {
            dimensions: { "geo": { "$or": [{ "is--country": true }] } }
          }
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
              concept: "pop",
              source: "fasttrack",
            },
            scale: {
              modelType: "size",
              allowedTypes: ["linear", "log", "genericLog", "pow", "point"]
            }
          },
          "y": {
            data: {
              concept: "lex",
              source: "fasttrack",
            },
            scale: {
              domain: [0, 100],
              zoomed: [19, 86],
              allowedTypes: ["linear", "log", "genericLog", "pow", "time"]
            }
          },
          "x": {
            data: {
              concept: "gdp_pcap",
              source: "fasttrack",
            },
            scale: {
              domain: [300, 180000],
              zoomed: [400, 96000],
              type: "log",
              allowedTypes: ["linear", "log", "genericLog", "pow", "time"]
            }
          },
          "color": {
            data: {
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
              extent: [0, 0.34],
              allowedTypes: ["linear", "log", "genericLog", "pow", "point"]
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
          // "centroid": {
          //   data: {
          //     space: ["geo"],
          //     concept: "baskod2010"
          //   }
          // },
          "lat": {
            data: {
              space: ["geo"],
              concept: "latitude"
            }
          },
          "lon": {
            data: {
              space: ["geo"],
              concept: "longitude"
            }
          },
          "color_map": {
            data: {
              concept: "geo",
              space: ["geo"],
            },
            scale: {
              modelType: "color"
            }
          },
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
    locale: { id: "en" },
    layout: { projector: false },

    //ui
    "buttons": {
      "buttons": ["colors", "markercontrols", "trails", "moreoptions", "presentation", "sidebarcollapse", "fullscreen"]
    },
    "dialogs": {
      "dialogs": {
        "popup": ["colors", "markercontrols", "moreoptions"],
        "sidebar": ["colors", "markercontrols", "size", "zoom"],
        "moreoptions": [
          "opacity",
          "speed",
          "axes",
          "size",
          "colors",
          "label",
          "zoom",
          "mapcolors",
          "mapoptions",
          "technical",
          "repeat",
          "presentation",
          "about"
        ]
      },
      "markercontrols": {
        "disableSlice": true,
        "disableAddRemoveGroups": true
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
      numberFormatSIPrefix: true,
      panWithArrow: true,
      adaptMinMaxZoom: false,
      cursorMode: "arrow",
      zoomOnScrolling: true,
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
          "income_per_person_gdppercapita_ppp_inflation_adjusted": [
            { "min": null, "max": 2650, "label": "incomegroups/level1", "label_short": "incomegroups/level1short" },
            { "min": 2650, "max": 8000, "label": "incomegroups/level2", "label_short": "incomegroups/level2short" },
            { "min": 8000, "max": 24200, "label": "incomegroups/level3", "label_short": "incomegroups/level3short" },
            { "min": 24200, "max": null, "label": "incomegroups/level4", "label_short": "incomegroups/level4short" }
          ]
        }
      },
      map: {
        overflowBottom: 0
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
        "wdi": "folder:other_datasets"
      }
    }
  }
};


VIZABI_MODEL = {
  model: {
    markers: {
      line: {
        requiredEncodings: ["x", "y"],
        data: {
          filter: {
            dimensions: {
              "country": {
                "country": {
                  $in: ["usa", "chn", "rus", "nga"]
                }
              }
            }
          },
          source: "sg",
          space: ["country", "time"]
        },
        encoding: {
          "show": {
            modelType: "selection",
            data: {
              filter: { dimensions: { "country": { "un_state": 1 } } }
            }
          },
          "selected": {
            modelType: "selection"
          },
          "highlighted": {
            modelType: "selection"
          },
          "y": {
            data: {
              concept: "income_per_person_gdppercapita_ppp_inflation_adjusted"
            },
            scale: {
              type: "log",
              allowedTypes: ["linear", "log", "genericLog", "pow"]
            }
          },
          "x": {
            data: {
              concept: "time"
            },
            scale: {
              type: "time",
              allowedTypes: ["linear", "log", "genericLog", "pow", "time"]
            }
          },
          "color": {
            data: {
              allow: {
                space: {
                  filter: {
                    concept_type: { $ne: "time" }
                  }
                }
              },
              space: ["country"],
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
          frame: {
            modelType: "frame",
            speed: 200,
            value: "2022",
            data: {
              concept: "time"
            }
          },
          "repeat": {
            modelType: "repeat",
            allowEnc: ["y", "x"]
          }
        }
      },
      "legend": {
        data: {
          ref: {
            transform: "entityConceptSkipFilter",
            path: "markers.line.encoding.color"
          }
        },
        encoding: {
          color: {
            data: {
              concept: { ref: "markers.line.encoding.color.data.concept" },
              constant: { ref: "markers.line.encoding.color.data.constant" }
            },
            scale: {
              modelType: "color",
              palette: { ref: "markers.line.encoding.color.scale.palette" },
              domain: null,
              range: null,
              type: null,
              zoomed: null,
              zeroBaseline: false,
              clamp: false,
              allowedTypes: null
            }
            //scale: { ref: "markers.line.encoding.color.scale" }
          },
          name: { data: { concept: "name" } },
          rank: { data: { concept: "rank" } },
          map: { data: { concept: "shape_lores_svg" } }
        }
      }
    }
  },
  ui: {
    locale: { id: "en" },
    layout: { projector: false },

    //ui
    "time-slider": {
      "show_value": true
    },
    "buttons": {
      "buttons": ["colors", "find", "moreoptions", "presentation", "sidebarcollapse", "fullscreen"],
    },
    "dialogs": {
      "dialogs": {
        "popup": ["colors", "find", "moreoptions"],
        "sidebar": ["colors", "find"],
        "moreoptions": ["opacity", "speed", "colors", "axes", "technical", "repeat", "presentation", "about"]
      },
      "find": {
        "panelMode": "show",
        "showTabs": {
          "country": "open fully"
        }
      }
    },
    chart: {
      showForecast: false,
      showForecastOverlay: true,
      pauseBeforeForecast: true,
      endBeforeForecast: "2022",
      opacityHighlight: 1.0,
      opacitySelect: 1.0,
      opacityHighlightDim: 0.1,
      opacitySelectDim: 0.3,
      opacityRegular: 0.8,
      hideXAxisValue: false,
      curve: "curveMonotoneX", //curveBasis curveLinear curveMonotoneX curveCatmullRom curveNatural
      whenHovering: {
        showTooltip: false,
        hideVerticalNow: false,
        showProjectionLineX: false,
        showProjectionLineY: false,
        higlightValueX: false,
        higlightValueY: false
      },
      labels: {
        min_number_of_entities_when_values_hide: 3,
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

VIZABI_MODEL = {
    model: {
      markers: {
        "bar": {
          requiredEncodings: ["x"],
          data: {
            source: "owid-covid",
            space: ["country", "time"],
            filter: {
              dimensions: { "country": { "un_state": true } }
            }
          },
          encoding: {
            "selected": {
              modelType: "selection"
            },
            "highlighted": {
              modelType: "selection"
            },
            "x": {
              data: {
                concept: "new_cases_smoothed_per_million",
              },
              scale: {
                allowedTypes: ["linear", "log", "genericLog", "pow"]
              }
            },
            "color": {
              data: {
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
              splash: false,
              interval: "day",
              data: {
                concept: "time"
              }
            },
            "repeat": {
              modelType: "repeat",
              allowEnc: ["x"]
            }
          }
        },
        "legend": {
          data: {
            ref: {
              transform: "entityConceptSkipFilter",
              path: "markers.bar.encoding.color"
            }
          },
          encoding: {
            color: {
              data: {
                concept: { ref: "markers.bar.encoding.color.data.concept" },
                constant: { ref: "markers.bar.encoding.color.data.constant" }
              },
              scale: {
                modelType: "color",
                palette: { ref: "markers.bar.encoding.color.scale.palette" },
                domain: null,
                range: null,
                type: null,
                zoomed: null,
                zeroBaseline: false,
                clamp: false,
                allowedTypes: null
              }
            },
            name: { data: { concept: "name" } },
            rank: { data: { concept: "rank" } },
            map: { data: { concept: "shape_lores_svg" } }
          }
        },
      }
    },
    ui: {
      locale: { id: "en" },
      layout: { projector: false },
  
      //ui
      "chart": {
        lilFrameDisplayAlwaysHidden: true,
        showForecast: false,
        showForecastOverlay: true,
        endBeforeForecast: null,
        pauseBeforeForecast: true,
        opacityHighlight: 1.0,
        opacitySelect: 1.0,
        opacityHighlightDim: 0.3,
        opacitySelectDim: 0.5,
        opacityRegular: 1.0,
      },
      "data-warning": {
        doubtDomain: [1800, 1950, 2015],
        doubtRange: [1.0, 0.3, 0.2]
      },
      "tree-menu": {
        "showDataSources": false,
        "folderStrategyByDataset": {
          "yearly": "spread",
          "covid_spread": "spread",
          "covid_response": "root",
          "covid_csv": "spread"
        }
      },
      "time-slider": {
        "show_value": false
      },
      "buttons": {
        "buttons": ["colors", "find", "moreoptions", "presentation", "sidebarcollapse", "fullscreen"],
      },
      "dialogs": {
        "dialogs": {
          "popup": ["timedisplay", "colors", "find", "moreoptions"],
          "sidebar": ["timedisplay", "colors", "find"],
          "moreoptions": ["opacity", "speed", "colors", "repeat", "technical", "presentation", "about"]
        },
        "find": {
          "panelMode": "find",
          "showTabs": {
            "country": "open"
          }
        }
      }
    }
  };
  
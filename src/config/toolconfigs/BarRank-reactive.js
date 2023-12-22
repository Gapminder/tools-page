export const VIZABI_MODEL = {
  model: {
    markers: {
      "bar": {
        requiredEncodings: ["x"],
        data: {
          source: "fasttrack",
          space: ["geo", "time"],
          filter: {
            dimensions: { "geo": { "$or": [{ "un_state": true }] } }
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
            modelType: "selection"
          },
          "highlighted": {
            modelType: "selection"
          },
          "x": {
            data: {
              concept: "pop",
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
          frame: {
            modelType: "frame",
            speed: 200,
            value: "2022",
            splash: true,
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
    "chart": {
      lilFrameDisplayAlwaysHidden: true,
      showForecast: false,
      showForecastOverlay: true,
      endBeforeForecast: "2022",
      pauseBeforeForecast: true,
      opacityHighlight: 1.0,
      opacitySelect: 1.0,
      opacityHighlightDim: 0.3,
      opacitySelectDim: 0.5,
      opacityRegular: 1.0,
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
    },
    "time-slider": {
      "show_value": false
    },
    "buttons": {
      "buttons": ["colors", "markercontrols", "moreoptions", "presentation", "sidebarcollapse", "fullscreen"],
    },
    "dialogs": {
      "dialogs": {
        "popup": ["timedisplay", "colors", "markercontrols", "moreoptions"],
        "sidebar": ["timedisplay", "colors", "markercontrols"],
        "moreoptions": ["opacity", "speed", "colors", "repeat", "technical", "presentation", "about"]
      }
    }
  }
};

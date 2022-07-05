VIZABI_MODEL = {
  model: {
    markers: {
      "bar": {
        data: {
          source: "sg",
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
      pauseBeforeForecast: true,
      opacityHighlight: 1.0,
      opacitySelect: 1.0,
      opacityHighlightDim: 0.3,
      opacitySelectDim: 0.5,
      opacityRegular: 1.0,
      datawarning: {
        doubtDomain: [],
        doubtRange: []
      }
    },
    "tree-menu": {
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
      "buttons": ["colors", "find", "moreoptions", "presentation", "sidebarcollapse", "fullscreen"],
    },
    "dialogs": {
      "dialogs": {
        "popup": ["timedisplay", "colors", "find", "moreoptions"],
        "sidebar": ["timedisplay", "colors", "find"],
        "moreoptions": ["opacity", "speed", "colors", "presentation", "about"]
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

VIZABI_MODEL = {
  model: {
    markers: {
      "mountain": {
        data: {
          source: "povcalnet",
          space: ["country", "time"],
          filter: {
            dimensions: { "country": { "un_state": true } }
          }
        },
        requiredEncodings: ["shapedata"],
        encoding: {
          "selected": {
            modelType: "selection"
          },
          "highlighted": {
            modelType: "selection"
          },
          "shapedata": { 
            data: { 
              concept: "income_mountain_50bracket_shape_for_log" 
            } 
          }, 
          "mu": {
            data: {
              constant: 0
            },
            scale: {
              type: "log",
              domain: [0.11, 500]
            },
            "tailFatX": 1.85,
            "tailCutX": 0.2,
            "tailFade": 0.7,
            "xScaleFactor": 1,
            "xScaleShift": 0
          },
          "color": {
            data: {
              space: ["country"],
              concept: "world_4region"
            },
            "scale": {
              modelType: "color",
              type: "ordinal",
              allowedTypes: ["ordinal"]
            }
          },
          "stack": {
            data: {
              constant: "all"
            },
            "merge": false
          },
          "group": {
            data: {
              space: ["country"],
              concept: "world_4region"
            },
            "merge": false,
            "manualSorting": []
          },
          "label": {
            data: {
              modelType: "entityPropertyDataConfig",
              concept: "name"
            }
          },
          frame: {
            value: "2021",
            modelType: "frame",
            speed: 200,
            splash: true,
            data: {
              concept: "time"
            }
          },
          "repeat": {
            modelType: "repeat",
            allowEnc: ["shapedata"]
          },
          "facet": {
            modelType: "facet",
            row: null
          }
        }
      },
      "legend": {
        data: {
          ref: {
            transform: "entityConceptSkipFilter",
            path: "markers.mountain.encoding.color"
          }
        },
        encoding: {
          color: {
            data: {
              concept: { ref: "markers.mountain.encoding.color.data.concept" },
              constant: { ref: "markers.mountain.encoding.color.data.constant" }
            },
            scale: {
              modelType: "color",
              palette: { ref: "markers.mountain.encoding.color.scale.palette" },
              type: null,
              domain: null,
              range: null,
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
      "decorations": {
        "enabled": true,
        "xAxisGroups": {
          "any": [
            { "min": null, "max": 2, "label": "incomegroups/level1", "label_short": "incomegroups/level1short" },
            { "min": 2, "max": 8, "label": "incomegroups/level2", "label_short": "incomegroups/level2short" },
            { "min": 8, "max": 32, "label": "incomegroups/level3", "label_short": "incomegroups/level3short" },
            { "min": 32, "max": null, "label": "incomegroups/level4", "label_short": "incomegroups/level4short" }
          ]
        }
      },
      "curve": "curveBasis",
      "showForecastOverlay": true,
      "showForecast": false,
      "pauseBeforeForecast": true,
      "endBeforeForecast": "2021",
      "opacityHighlight": 1.0,
      "opacitySelect": 1.0,
      "opacityHighlightDim": 0.1,
      "opacitySelectDim": 0.3,
      "opacityRegular": 0.8, 
      "yMaxMethod": 1 
    },
    "data-warning": {
      doubtDomain: [1800, 1950, 2020],
      doubtRange: [1.0, 0.3, 0.2]
    },
    "time-slider": {
      "show_value": false
    },
    "buttons": {
      "buttons": ["colors", "find", "stack", "moreoptions", "presentation", "sidebarcollapse", "fullscreen"],
    },
    "dialogs": {
      "dialogs": {
        "popup": ["colors", "find", "stack", "moreoptions"],
        "sidebar": ["colors", "find", "stack"],
        "moreoptions": ["opacity", "speed", "colors", "stack", "technical", "presentation", "about"]
      },
      "find": {
        "panelMode": "find",
        "showTabs": {
          "country": "open"
        }
      }
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

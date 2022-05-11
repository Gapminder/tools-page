VIZABI_MODEL = {
  model: {
    markers: {
      "mountain": {
        data: {
          source: "povcalnet",
          space: ["geo", "time"],
          filter: {
            dimensions: { 
             // "geo": { "is--world_4region": true },
             // "geo": { "is--country": true },
             "geo": { "un_state": true }
              // "geo": { "$or": [
              //   { "is--world_4region": true },
              //   { "is--west_and_rest": true },
              //   { "un_state": true },
              //   { "is--global": true }
              // ]}
              //"geo": { "geo": {"$in": ["asia", "africa", "chn"]}},
              //"time": {"time": "2021"}
            }
          }
        },
        requiredEncodings: ["shapedata", "facet_row"],
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
              space: ["geo"],
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
              constant: "all",
              space: null,
              concept: null
            },
            "merge": false
          },
          "group": {
            data: {
              space: ["geo"],
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
          "facet_row": {
            data: {
              //set space and concept
              //or constant="none" or magic concept="is--" with possible exceptions
              modelType: "entityMembershipDataConfig",
              space: ["geo"],
              constant: "none",
              concept: null,
              exceptions: null
              //concept: "world_4region"
              //concept: "is--",
              //exceptions: {"is--country": "geo"},
            }
          },
          "maxheight": {
            limit: 966980928,
            data: {
              space: ["geo"],
              concept: "income_mountain_50bracket_max_height_for_log"
            }
          },
          "povertyline": {
            data: {
              concept: "poverty_line"
            }
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
      "yMaxMethod": 1,
      showProbeX: true,
      probeX: 1.85,
      probeXCustom: 4,
      probeXType: "extreme",
      probeXDetails: {
        belowProc: true,
        belowCount: false,
        aboveProc: false,
        aboveCount: false
      },
    },
    "data-warning": {
      doubtDomain: [1800, 1950, 2020],
      doubtRange: [0, 0, 0]
    },
    "time-slider": {
      "show_value": false
    },
    "buttons": {
      "buttons": ["colors", "find", "moreoptions", "presentation", "sidebarcollapse", "fullscreen"],
    },
    "dialogs": {
      "dialogs": {
        "popup": ["presets", "colors", "find", "moreoptions"],
        "sidebar": ["presets", "colors", "find"],
        "moreoptions": ["opacity", "speed", "colors", "stack", "povertyline", "technical", "presentation", "about"]
      },
      "find": {
        "enableSelectShowSwitch": true,
        "panelMode": "find",
        "showTabs": {
          "geo": "open"
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

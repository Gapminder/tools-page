VIZABI_MODEL = {
  model: {
    markers: {
      "mountain": {
        data: {
          locale: "en",
          source: "sg",
          space: ["country", "time"]
        },
        requiredEncodings: ["x", "y", "s"],
        encoding: {
          "unstate": {
            data: {
              space: ["country"],
              concept: "un_state"
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
              concept: "income_per_person_gdppercapita_ppp_inflation_adjusted"
            },
            scale: {
              type: "log",
              domain: [0.11, 500]
            },
            "tailFatX": 1.85,
            "tailCutX": 0.2,
            "tailFade": 0.7,
            "xScaleFactor": 1.039781626,
            "xScaleShift": -1.127066411
          },
          "y": {
            data: {
              concept: "population_total"
            }
          },
          "s": {
            data: {
              concept: "gapminder_gini"
            }
          },
          "color": {
            data: {
              space: ["country"],
              concept: "world_4region"
            },
            "scale": {
              modelType: "color",
              type: "ordinal"
            }
          },
          "stack": {
            data: {
              space: ["country"],
              constant: "all"
            },
            "merge": false
          },
          "group": {
            data: {
              space: ["country"],
              concept: "world_4region"
            },
            "merge": false
          },
          "label": {
            data: {
              space: ["country"],
              modelType: "entityPropertyDataConfig",
              concept: "name"
            }
          },
          frame: {
            value: "2019",
            endBeforeForecast: "2019",
            modelType: "frame",
            speed: 200,
            data: {
              concept: "time"
            }
          }
        }
      },
      "legend": {
        data: {
          ref: {
            transform: "entityConceptSkipFilter",
            model: "markers.mountain.encoding.color"
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
              zoomed: null
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
    //ui
    "chart": {
      "decorations": {
        "enabled": true,
        "xAxisGroups": {
          "income_per_person_gdppercapita_ppp_inflation_adjusted": [
            {"min": null, "max": 2, "label": "incomegroups/level1", "label_short": "incomegroups/level1short"},
            {"min": 2, "max": 8, "label": "incomegroups/level2", "label_short": "incomegroups/level2short"},
            {"min": 8, "max": 32, "label": "incomegroups/level3", "label_short": "incomegroups/level3short"},
            {"min": 32, "max": null, "label": "incomegroups/level4", "label_short": "incomegroups/level4short"}
          ]
        }
      },
      "showForecastOverlay": true,
      "showForecast": true,
      "pauseBeforeForecast": true,
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
        "moreoptions": ["opacity", "speed", "colors", "stack", "presentation", "about"]
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
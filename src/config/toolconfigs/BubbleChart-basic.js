VIZABI_MODEL = {
  model: {
    markers: {
      bubble: {
        requiredEncodings: ["x", "y", "size"],
        data: { 
          source: "mdtest",
          filter: {},
          space: ["country", "time"]
        },
        encoding: {
          "selected": {
            modelType: "selection",
            data: {
              filter: {
                ref: "markers.bubble.encoding.trail.data.filter"
              }
            }
          },
          "highlighted": { modelType: "selection" },
          "superhighlighted": { modelType: "selection" },
          "y": {
            data: {
              space: ["country", "time"],
              filter: {},
              concept: "life_expectancy"
            }
          },
          "x": {
            data: {
              space: ["country", "time"],
              filter: {},
              concept: "income_per_person_gdppercapita_ppp_inflation_adjusted"
            }
          },
          "order": { modelType: "order",
            data: { concept: {
              ref: "markers.bubble.encoding.size.data.concept"
            } }
          },
          "size": {
            scale: {
              modelType: "size",
              range: [0, 50]
            }
          },
          "color": { scale: { modelType: "color" } },
          "label": { data: { modelType: "entityPropertyDataConfig" } },
          "frame": { modelType: "frame", value: "2016" },
          "trail": { modelType: "trail" }
        }
      }
    }
  },
  ui: {
    locale: { id: "en" },
    layout: { projector: false },

    //ui
    "buttons": {
      "buttons": ["colors", "find", "trails", "moreoptions", "presentation", "sidebarcollapse", "fullscreen"]
    },
    "dialogs": {
      "dialogs": {
        "popup": ["colors", "find", "moreoptions"],
        "sidebar": ["colors", "find", "size", "zoom"],
        "moreoptions": [
          "opacity",
          "speed",
          //"axes",
          "size",
          "colors",
          "label",
          "zoom",
          "technical",
          "repeat",
          "presentation",
          "about"
        ]
      }
    },


    "chart": {
      show_ticks: true,
      showForecast: false,
      showForecastOverlay: true,
      pauseBeforeForecast: true,
      endBeforeForecast: "2019",
      opacityHighlight: 1.0,
      opacitySelect: 1.0,
      opacityHighlightDim: 0.1,
      opacitySelectDim: 0.3,
      opacityRegular: 0.8,
      timeInBackground: true,
      timeInTrails: true,
      lockNonSelected: 0,
      numberFormatSIPrefix: true,
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
          "income_per_person_gdppercapita_ppp_inflation_adjusted": [
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
      doubtRange: [1.0, 0.3, 0.2]
    },
    "tree-menu": {
      "folderStrategyByDataset": {
        "sg": "spread",
        "fasttrack": "spread",
        "wdi": "folder:other_datasets"
      }
    }
  }
};

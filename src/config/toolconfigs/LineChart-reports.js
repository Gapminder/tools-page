
VIZABI_MODEL = {
  model: {
    markers: {
      line: {
        requiredEncodings: ["x", "y"],
        data: {
          locale: "en",
          source: "csv",
          space: ["country", "day"]
        },
        encoding: {
          "selected": {
            modelType: "selection"
          },
          "highlighted": {
            modelType: "selection"
          },
          "y": {
            data: {
              concept: "value"
            },
            scale: {
              type: "linear",
              allowedTypes: ["linear", "log", "genericLog", "pow"]
            }
          },
          "x": {
            data: {
              concept: "day"
            }
          },
          "color": {
            data: {
              space: ["country"],
              concept: "country"
            },
            scale: {
              modelType: "color",
              type: "ordinal",
              allowedTypes: ["ordinal", "point"],
              palette: { "palette": {
                "ApprovedQs": "#E6943B",
                "10qPicked": "#8B2CF9",
                "Transl": "#44E2E0",
                "Survey": "#DC513C",
                "Results": "#0C2BF9",
                "A-picked": "#E64E25",
                "O-picked": "#25CEFB",
                "Draft": "#E47D76",
                "A-edited": "#E51630",
                "O-edited": "#27EE42",
                "Ready": "#E62E2F",
                "Delivered": "#000000"
              } }
            }
          },
          "label": {
            data: {
              concept: "country"
            }
          },
          frame: {
            modelType: "frame",
            speed: 200,
            value: "2021-03-14",
            data: {
              concept: "day"
            }
          }
        }
      },
      "legend": {
        data: {
          ref: {
            transform: "entityConceptSkipFilter",
            model: "markers.line.encoding.color"
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
    //ui
    "day-slider": {
      "show_value": true
    },
    "buttons": {
      "buttons": ["colors", "moreoptions", "presentation", "sidebarcollapse", "fullscreen"],
    },
    "dialogs": {
      "dialogs": {
        "popup": ["colors", "moreoptions"],
        "sidebar": ["colors"],
        "moreoptions": ["opacity", "speed", "colors", "axes", "presentation", "about"]
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
      opacityHighlight: 1.0,
      opacitySelect: 1.0,
      opacityHighlightDim: 0.1,
      opacitySelectDim: 0.3,
      opacityRegular: 0.8,
      hideXAxisValue: false,
      curve: "curveMonotoneX",
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
      },
      datawarning: {
        doubtDomain: [1800, 1950, 2015],
        doubtRange: [1.0, 0.3, 0.2]
      }
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

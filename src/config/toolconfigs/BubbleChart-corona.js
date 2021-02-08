VIZABI_MODEL = {
  model: {
    markers: {
      bubble: {
        modelType: "bubble",
        data: {
          locale: "en",
          source: "csv1",
          space: ["postnummer", "week"]
        },
        requiredEncodings: ["x1", "y1", "size"],
        encoding: {
          "selected": {
            modelType: "selection",
            data: { ref: "markers.bubble.encoding.trail.data" }
          },
          "highlighted": {
            modelType: "selection"
          },
          //enabling order encoding results in chart not respecting splash load and waiting full data to render both splash and full picture
          // "order": {
          //   modelType: "order",
          //   data: {
          //     ref: "markers.bubble.encoding.size.data",
          //     direction: "desc"
          //   }
          // },
          "size": {
            data: {
              concept: "Befolkning Totalt",
              source: "csv2"

            },
            scale: {
              //type: "log"
            }
          },
          "y1": {
            data: {
              concept: "cases_per_capita_2w5",
              source: "corona"
            },
            scale: {
              //domain: [20, 40]
            }
          },
          "x1": {
            data: {
              concept: "Inkomst: Median",
              source: "csv2"
            },
            scale: {
              type: "linear"
            }
          },
          "color": {
            data: {
              space: ["postnummer", "week"],
              concept: "0 personbilar"
            },
            scale: {
              modelType: "color",
              type: "linear"
            }
          },
          "label": {
            data: {
              //space: ["postnummer"],
              modelType: "entityPropertyDataConfig",
              concept: "postnummer"
            }
          },
          "size_label": {
            data: {
              constant: "_default"
            },
            scale: {
              modelType: "size"
            }
          },
          frame: {
            modelType: "frame",
            speed: 200,
            value: "2013",
            data: {
              concept: "week"
            }
          },
          "trail": {
            modelType: "trail",
            groupDim: "week"
          },
          "repeat": {
            modelType: "repeat",
            row: ["y1"],
            column: ["x1"]
          }
        }
      },
      "legend": {
        data: {
          ref: {
            transform: "entityConceptSkipFilter",
            model: "markers.bubble.encoding.color"
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
              palette: { ref: "markers.bubble.encoding.color.scale.palette" }
            }
            //scale: { ref: "markers.bubble.encoding.color.scale" }
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
          "presentation",
          "about"
        ]
      }
    },
    "chart": {
      labels: {
        removeLabelBox: true
      }
    },
    "tree-menu": {
      "folderStrategyByDataset": {
        "sg": "spread",
        "fasttrack": "spread",
        "wdi": "folder:other_datasets"
      }
    },
  }
};
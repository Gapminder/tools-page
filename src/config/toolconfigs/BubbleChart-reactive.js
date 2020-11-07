VIZABI_MODEL = {
  model: {
    markers: {
      bubble: {
        modelType: "bubble",
        data: {
          locale: "en",
          source: { ref: "datasources.sg" },
          space: ["country", "time"],
          // filter: {
          //   markers: {},
          //   dimensions: {
          //     geo: {
          //       "geo.is--un_state": true
          //     }
          //   }
          // }
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
          "order": {
            modelType: "order",
            data: {
              ref: "markers.bubble.encoding.size.data",
              direction: "desc"
            }
          },
          "size": {
            data: {
              concept: "population_total"
            },
            scale: {
              //type: "log"
            }
          },
          "y1": {
            data: {
              concept: "life_expectancy_years",
            },
            scale: {
              //domain: [20, 40]
            }
          },
          "x1": {
            data: {
              concept: "income_per_person_gdppercapita_ppp_inflation_adjusted"
            },
            scale: {
              type: "log"
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
              //space: ["country"],
              modelType: "entityPropertyDataConfig",
              concept: "name"
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
            value: "2019",
            data: {
              concept: {
                autoconfig: {
                  concept_type: "time"
                }
              }
            }
          },
          "trail": {
            modelType: "trail",
            groupDim: "time"
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
    }
  }
};

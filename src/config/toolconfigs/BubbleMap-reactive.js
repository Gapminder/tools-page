__data = {
  modelType: "ddfcsv",
  path: "./data/ddf--jheeffer--mdtest/"
};

VIZABI_MODEL = {
  model: {
    markers: {
      bubble: {
        data: {
          locale: "en",
          source: __data,
          space: {
            autoconfig: {
              concept: {
                $nin: ["age"]
              }
            }
          }
        },
        encoding: {
          "selected": {
            modelType: "selection"
          },
          "highlighted": {
            modelType: "selection"
          },
          "size": {
            data: {
              concept: "population_total"
            },
          },
          "lat": {
            data: {
              space: ["geo"],
              concept: "latitude"
            }
          },
          "lon": {
            data: {
              space: ["geo"],
              concept: "longitude"
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
          "frame": {
            modelType: "frame",
            speed: 200,
            data: {
              concept: {
                autoconfig: {
                  concept_type: "time"
                }
              }
            }
          }
        },
        requiredEncodings: ["lat", "lon", "size"]
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
      }
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
        "sidebar": ["colors", "find", "size"],
        "moreoptions": [
          "opacity",
          "speed",
          //"axes",
          "size",
          "colors",
          "label",
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

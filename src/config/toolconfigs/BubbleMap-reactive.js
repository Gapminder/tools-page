VIZABI_MODEL = {
  model: {
    markers: {
      bubble: {
        data: {
          locale: "en",
          source: "sg",
          space: ["country", "time"]
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
            scale: {
              modelType: "size"
            }
          },
          "lat": {
            data: {
              space: ["country"],
              concept: "latitude"
            }
          },
          "lon": {
            data: {
              space: ["country"],
              concept: "longitude"
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
          //"label",
          "technical",
          "presentation",
          "about"
        ]
      }
    },
    "chart": {
      labels: {
        removeLabelBox: false
      }
    }
  }
};

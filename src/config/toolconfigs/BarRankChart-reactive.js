VIZABI_MODEL = {
  model: {
    markers: {
      "bar": {
        requiredEncodings: ["x"],
        data: {
          locale: "en",
          source: "sg",
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
          "x": {
            data: {
              concept: "population_total"
            }
          },
          "y": {
            data: {
              space: ["country"],
              concept: "name"
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
              space: ["country"],
              modelType: "entityPropertyDataConfig",
              concept: "name"
            }
          },
          frame: {
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
        }
      },
      "legend": {
        data: {
          ref: {
            transform: "entityConceptSkipFilter",
            model: "markers.bar.encoding.color"
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
              palette: { ref: "markers.bar.encoding.color.scale.palette" }
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
        "panelMode": "show",
        "showTabs": {
          "country": "open"
        }
      }
    }
  }
};

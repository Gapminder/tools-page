const __data = {
  modelType: "ddfcsv",
  path: "./data/ddf--jheeffer--mdtest"
};

const VIZABI_MODEL = {
  model: {
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
      "x": {
        data: {
          concept: "population_total"
        }
      },
      "y": {
        data: {
          concept: "country"
        }
      },
      "color": {
        data: {
          space: ["country"],
          concept: "world_4region"
        },
        scale: {
          type: "ordinal"
        }
      },
      "label": {
        data: {
          space: ["country"],
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

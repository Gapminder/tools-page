export const VIZABI_MODEL = {
  "model": {
    "markers": {
      "bubble": {
        "requiredEncodings": ["lat", "lon", "size"],
        "data": {
          "source": "sg",
          "space": ["geo", "time"],
          "filter": { "dimensions": { "geo": { "$or": [{ "un_state": true }] } } }
        },
        "encoding": {
          "show": {
            "data": {
              "filter": { "dimensions": { "geo": { "$not": { "is--country": 1, "un_state": 0 } } } }
            }
          },
          "color": {
            "data": {
              "space": ["geo"],
              "concept": "world_4region",
              "constant": null
            },
            "scale": {
              "type": "ordinal"
            }
          },
          "color_map": {
            "data": {
              "space": ["geo"],
              "concept": "landlocked",
            },
            "scale": {
              "type": "ordinal"
            }
          },
          "size": {
            "data": {
              "concept": "pop",
              "source": "fasttrack",
              "constant": null
            }
          },
          "label": {
            "data": {
              "concept": "name"
            }
          },
          "lat": {
            "data": {
              "space": ["geo"],
              "concept": "latitude"
            }
          },
          "lon": {
            "data": {
              "space": ["geo"],
              "concept": "longitude"
            }
          },
          "frame": {
            "value": "2024",
            "data": {
              "concept": "time"
            }
          },
        },
      },
      "legend": {
        "encoding": {
          "name": { "data": { "concept": "name" } },
          "order": { "data": { "concept": "name" } },
          "map": { "data": { "concept": "shape_lores_svg" } }
        }
      },
      "legend_map": {
        "encoding": {
          "name": { "data": { "concept": "name" } },
          "order": { "data": { "concept": "name" } },
          "map": { "data": { "concept": null } }
        }
      }
    }
  },
  "ui": {
    "locale": { "id": "en", "shortNumberFormat": true },
    "layout": { "projector": false },

    "dialogs": {
      "markercontrols": {
        "disableSlice": false,
        "disableAddRemoveGroups": false
      }
    },
    "chart": {
      "labels": {
        "removeLabelBox": false
      },
      "map": {
        "showBubbles": true,
        "topology": {
          "path": "assets/world-50m.json",
          "objects": {
            "areas": "countries",
            "boundaries": "countries"
          }
        }
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

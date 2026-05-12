export const VIZABI_MODEL = {
  "model": {
    "markers": {
      "bubble": {
        "data": {
          "filter": {
            "dimensions": { "geo": { "$or": [{ "is--kommun": true }] } }
          }
        },
        "encoding": {
          "show": {
            "data": {
              "filter": { "dimensions": { "geo": { "$not": { "is--deso": 1 } } } }
            }
          },
          "size": {
            "data": {
              "concept": "antal",
              "constant": null
            },
            "scale": {
              "extent": [0, 0.5]
            }
          },
          "color": {
            "data": {
              "concept": "mean_hogskola_25_64",
              "constant": null
            },
            "scale": {
              "type": "linear"
            }
          },
          "color_map": {
            "data": {
              "concept": "mean_hogskola_25_64"
            }
          },
          "label": {
            "data": {
              "concept": "name"
            }
          },
          "centroid": {
            "data": {
              "space": ["geo"],
              "concept": "geo"
            }
          },
          "frame": {
            "data": {
              "concept": "year"
            },
            "value": "2021"
          },
        },
      },
      "legend": {
        "encoding": {
          "name": { "data": { "concept": "name" } },
          "order": { "data": { "concept": "name" } }
        }
      },
      "legend_map": {
        "encoding": {
          "name": { "data": { "concept": "name" } },
          "order": { "data": { "concept": "name" } }
        }
      }
    }
  },
  "ui": {
    "locale": { "id": "sv-SE" },
    "dialogs": {
      "markercontrols": {
        "disableSlice": true,
        "disableAddRemoveGroups": false,
        "primaryDim": "geo",
        "drilldown": "region.kommun.regso",
        "shortcutForSwitch": true,
        "shortcutForSwitch_allow": ["kommun", "regso"],
      }
    },
    "tree-menu": {
      "folderStrategyByDataset": {
        "kolada": "spread",
        "boba": "spread"
      }
    },
    "marker-contextmenu": {
      "primaryDim": "geo",
      "drilldown": "region.kommun.regso",
      "allowExplodeTo": ["regso"],
      "allowFoldTo": ["kommun"]
    },
    "chart": {
      "endBeforeForecast": "2022",
      "map": {
        "bounds": {
          "west": 4, "north": 69, "east": 25, "south": 56
        }
      }
    },
    "data-warning": {
      "enable": true
    }
  }
};
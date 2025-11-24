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
          "color_map": {
            "data": {
              "concept": "mean_pensionar"
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
        "healthatlas": "spread"
      }
    },
    "marker-contextmenu": {
      "drilldown": "region.kommun.regso",
      "primaryDim": "geo"
    },
    "chart": {
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
export const VIZABI_MODEL = {
  "model": {
    "markers": {
      "bubble": {
        "data": {
          "space": ["geo", "year"],
          "filter": { "dimensions": { "geo": { "$or": [{ "is--kommun": true }] } } }
        },
        "encoding": {
          "show": {
            "data": {
              "filter": { "dimensions": { "geo": { "$not": { "is--deso": 1 } } } }
            }
          },
          "size": {
            "data": { "concept": "antal" },
          },
          "y": {
            "data": { "concept": "mean_pensionar" },
          },
          "x": {
            "data": { "concept": "mean_alder" }
          },
          "color": {
            "data": { "space": ["geo"], "concept": "region", "constant": null }
          },
          "label": {
            "data": { "concept": "name" }
          },
          "size_label": {
            "data": { "constant": "_default" }
          },
          "frame": {
            "value": "2022",
            "data": { "concept": "year" }
          },
          "trail": {
            "groupDim": "year",
            "show": true
          }
        }
      },
      "legend": {
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
    "marker-contextmenu": {
      "primaryDim": "geo",
      "drilldown": "region.kommun.regso"
    },
    "chart": {
      "endBeforeForecast": "2022"
    },
    "data-warning": {
      "enable": true
    },
    "tree-menu": {
      "folderStrategyByDataset": {
        "kolada": "spread",
        "boba": "spread"
      }
    }
  }
};

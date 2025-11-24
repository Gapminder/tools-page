export const VIZABI_MODEL = {
  "ui": {
    "locale": { "id": "sv-SE" },
    "chart": {
      "sendTools": [
        {
          "icon": "🏀",
          "tool": "bubbles",
          "label": "Bubbles (as Y axis)",
          "marker": "bubble",
          "encoding": "y",
          "selected": "trail"
        },
        {
          "icon": "🗺",
          "tool": "extapimap",
          "label": "Map (as area color)",
          "marker": "bubble",
          "encoding": "color_map"
        }
      ],
      "opacitySelectDim": 0.3
    },
    "dialogs": {
      "markercontrols": {
        "drilldown": "region.kommun.regso",
        "primaryDim": "geo",
        "disableSlice": true,
        "shortcutForSwitch": true,
        "disableAddRemoveGroups": false,
        "shortcutForSwitch_allow": [
          "kommun",
          "regso"
        ]
      }
    },
    "tree-menu": {
      "showDataSources": false,
      "folderStrategyByDataset": {
        "kolada": "spread",
        "healthatlas": "spread"
      }
    },
    "marker-contextmenu": {
      "drilldown": "region.kommun.regso",
      "primaryDim": "geo"
    }
  },
  "model": {
    "markers": {
      "spreadsheet": {
        "data": {
          "space": [
            "geo",
            "year"
          ],
          "filter": {
            "dimensions": {
              "geo": {
                "$or": [
                  {
                    "is--kommun": true
                  }
                ]
              }
            }
          }
        },
        "encoding": {
          "show": {
            "data": {
              "filter": {
                "dimensions": {
                  "geo": {
                    "$not": {
                      "is--deso": 1
                    }
                  }
                }
              }
            }
          },
          "frame": {
            "data": {
              "concept": "year"
            },
            "value": "2022"
          },
          "label": {
            "data": {
              "concept": "name"
            }
          },
          "number": {
            "data": {
              "concept": "mean_dispink_20_64"
            }
          }
        }
      }
    }
  }
};
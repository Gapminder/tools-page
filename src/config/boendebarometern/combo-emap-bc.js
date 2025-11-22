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
            "data": { "concept": "antal" }
          },
          "y": {
            "data": { "concept": "mean_dispink_20_64" },
          },
          "x": {
            "data": { "concept": "mean_hogskola_25_64" }
          },
          "color": {
            "data": { "space": ["geo"], "concept": "region", "constant": null }
          },
          "color_map": {
            "data": { "concept": "mean_hogskola_25_64" }
          },
          "label": {
            "data": { "concept": "name" }
          },
          "frame": {
            "value": "2022",
            "data": { "concept": "year" }
          },
          "trail": {
            "groupDim": "year",
            "show": true
          },
          "centroid": {
            "data": {
              "space": ["geo"],
              "concept": "geo"
            }
          }    
        }
      },
      "legend": {
        "name": { "data": { "concept": "name" } },
        "order": { "data": { "concept": "name" } }
      },
      "legend_map": {
        "name": { "data": { "concept": "name" } },
        "order": { "data": { "concept": "name" } }
      }
    }
  },
  "ui": {
    "locale": { "id": "sv-SE" },
    "dialogs": {
      "dialogs": {
        "moreoptions": [
          "opacity",
          "speed",
          "axes",
          "size",
          "colors",
          "label",
          "mapcolors",
          "mapoptions",
          "zoom",
          "about"
        ]
      },
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
      "splitVertical": true,
      "splitRatio": 0.65,
      "map": {
        "useBivariateColorScaleWithDataFromXY": false,
        "bivariateColorPalette": "BlPu5",
        "bounds": {
          "west": 4, "north": 69, "east": 25, "south": 56
        }
      }
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

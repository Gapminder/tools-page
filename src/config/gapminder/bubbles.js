export const VIZABI_MODEL = {
  "model": {
    "markers": {
      "bubble": {
        "data": {
          "source": "fasttrack",
          "space": ["geo", "time"],
          "filter": { "dimensions": { "geo": { "$or": [{ "un_state": true }] } } }
        },
        "encoding": {
          "show": {
            "data": { 
              "filter": { "dimensions": { "geo": { "$not": { "is--country": 1, "un_state": 0 } } } } 
            }
          },
          "size": {
            "data": { "concept": "pop" }
          },
          "y": {
            "data": { "concept": "lex" },
            "scale": {
              "domain": [0, 100],
              "zoomed": [19, 86]
            }
          },
          "x": {
            "data": { "concept": "gdp_pcap" },
            "scale": {
              "domain": [300, 180000],
              "zoomed": [750, 96000],
              "type": "log"
            }
          },
          "color": {
            "data": { "space": ["geo"], "concept": "world_4region", "constant": null },
            "scale": {
              "type": "ordinal"
            }
          },
          "label": {
            "data": { "concept": "name" }
          },
          "frame": {
            "value": "2023",
            "data": { "concept": "time" }
          },
          "trail": {
            "groupDim": "time",
            "show": true
          }
        }
      },
      "legend": {
        "encoding": {
          "name": { "data": { "concept": "name" } },
          "order": { "data": { "concept": "rank" } },
          "map": { "data": { "concept": "shape_lores_svg" } }
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
      "endBeforeForecast": "2023",
      "panWithArrow": false,
      "zoomOnScrolling": false,
      "decorations": {
        "enabled": true,
        "xAxisGroups": {
          "gdp_pcap": [
            { "min": null, "max": 3200, "label": "incomegroups/level1", "label_short": "incomegroups/level1short" },
            { "min": 3200, "max": 12000, "label": "incomegroups/level2", "label_short": "incomegroups/level2short" },
            { "min": 12000, "max": 36000, "label": "incomegroups/level3", "label_short": "incomegroups/level3short" },
            { "min": 36000, "max": 108000, "label": "incomegroups/level4", "label_short": "incomegroups/level4short" },
            { "min": 108000, "max": 324000, "label": "incomegroups/level5", "label_short": "incomegroups/level5short" },
            { "min": 324000, "max": 972000, "label": "incomegroups/level6", "label_short": "incomegroups/level6short" },
            { "min": 972000, "max": null, "label": "incomegroups/level7", "label_short": "incomegroups/level7short" }
          ]
        }
      }
    },
    "data-warning": {
      "enable": true,
    },
    "tree-menu": {
      "folderStrategyByDataset": {
        "sg": "spread",
        "fasttrack": "spread",
        "country_flags": "spread",
        "wdi": "folder:other_datasets"
      }
    }
  }
};

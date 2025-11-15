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
              "zoomed": [19, 86],
            }
          },
          "x": {
            "data": { "concept": "gdp_pcap" },
            "scale": {
              "domain": [300, 180000],
              "zoomed": [400, 96000],
              "type": "log",
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
      },
    }
  },
  "ui": {
    "locale": { "id": "en", "shortNumberFormat": true },
    "layout": { "projector": false },
    "dialogs": {
      "markercontrols": {
        "disableSlice": false,
        "disableAddRemoveGroups": false,
        "primaryDim": "geo"
      }
    },
    "chart": {
      "endBeforeForecast": "2023",
      "decorations": {
        "enabled": true,
        "xAxisGroups": {
          "gdp_pcap": [
            { "min": null, "max": 2650, "label": "incomegroups/level1", "label_short": "incomegroups/level1short" },
            { "min": 2650, "max": 8000, "label": "incomegroups/level2", "label_short": "incomegroups/level2short" },
            { "min": 8000, "max": 24200, "label": "incomegroups/level3", "label_short": "incomegroups/level3short" },
            { "min": 24200, "max": null, "label": "incomegroups/level4", "label_short": "incomegroups/level4short" }
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


export const VIZABI_MODEL = {
  "model": {
    "markers": {
      "line": {
        "data": {
          "space": ["geo", "time"],
          "filter": { "dimensions": { "geo": { "$or": [{ "geo": { "$in": ["usa", "chn", "rus", "nga"] } }] } } }
        },
        "encoding": {
          "show": {
            "data": {
              "filter": { "dimensions": { "geo": { "$not": { "is--country": 1, "un_state": 0 } } } }
            }
          },
          "y": {
            "data": { "concept": "gdp_pcap" },
            "scale": { "type": "log" }
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
        "disableAddRemoveGroups": false,
        "drilldown": "country",
        "primaryDim": "geo"
      }
    },
    "chart": {
      "endBeforeForecast": "2023"
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

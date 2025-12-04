export const VIZABI_MODEL = {
  "model": {
    "markers": {
      "bar": {
        "data": {
          "space": ["geo", "time"],
          "filter": { "dimensions": { "geo": { "$or": [{ "un_state": true }] } } }
        },
        "encoding": {
          "show": {
            "data": {
              "filter": { "dimensions": { "geo": { "$not": { "is--country": 1, "un_state": 0 } } } }
            }
          },
          "x": {
            "data": { "concept": "pop" }
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
            "value": "2024",
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
        "disableAddRemoveGroups": false
      }
    },
    "chart": {
      "endBeforeForecast": "2024",
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

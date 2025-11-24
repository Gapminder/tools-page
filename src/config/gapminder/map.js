export const VIZABI_MODEL = {
  "model": {
    "markers": {
      "bubble": {
        "data": {
          "source": "sg",
          "space": ["geo", "time"],
          "filter": { "dimensions": { "geo": { "$or": [{ "is--country": true }] } } }
        },
        "encoding": {
          "show": {
            "data": {
              "filter": { "dimensions": { "geo": { "$not": { "is--country": 1, "un_state": 0 } } } }
            }
          },
          "size": {
            "data": { "source": "fasttrack", "concept": "pop" },
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
      "endBeforeForecast": "2023",
      "map": {
        "scale": 1.1,
        "rotate": [-11, 0],
        "offset": { "top": 0.05, "right": 0.01, "bottom": 0.05, "left": -0.12 },
        "projection": "geo" + "Aitoff",
        "topology": {
          "path": "assets/world-50m.json",
          "objects": {
            "areas": "countries",
            "boundaries": null
          },
          "geoIdProperty": "id"
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

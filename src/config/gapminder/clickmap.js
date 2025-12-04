export const VIZABI_MODEL = {
  "model": {
    "markers": {
      "bubble": {
        "data": {
          "source": "sg",
          "space": ["geo", "time"]
        },
        "encoding": {
          "show": {
            "data": {
              "filter": { "dimensions": { "geo": { "$not": { "is--country": 1, "un_state": 0 } } } }
            }
          },
          "size": {
            "data": {
              "source": "fasttrack",
              "concept": "gapminder_index"
            },
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
            "data": {
              "source": "fasttrack",
              "concept": "gapminder_index",
              "constant": null
            },
            "scale": {
              "type": "linear",
              "domain": [-85, 10],
              "range": null,
              "zoomed": null,
              "zeroBaseline": false,
              "clamp": false,
              "allowedTypes": null,
              "palette": {
                "palette": {
                  "0": "#3e0693",
                  "25": null,
                  "31": "#8e25e3",
                  "37": "#ae45e8",
                  "50": null,
                  "62": "#dc5dfd",
                  "68": "#feb54c",
                  "75": null,
                  "89": "#fef14c",
                  "100": "#fffce5"
                }
              }
            }
          },
          "label": {
            "data": { "concept": "name" }
          },
          "frame": {
            "value": "2021",
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
  ui: {
    "locale": { "id": "en", "shortNumberFormat": true },
    "layout": { "projector": false },

    "buttons": {
      "sidebarCollapse": true,
      "buttons": ["markercontrols"]
    },
    "dialogs": {
      "markercontrols": {
        "disableSlice": false,
        "disableAddRemoveGroups": false
      }
    },
    "chart": {
      "opacityRegular": 0,
      "timeInBackground": false,
      "clickUrl": "https://www.gapminder.org/ignorance/gapminder-index-pilot/?country=",
      "endBeforeForecast": "2024",
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

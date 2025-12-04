export const VIZABI_MODEL = {
  "model": {
    "markers": {
      "bubble": {
        "requiredEncodings": ["x", "y", "lat", "lon", "size"],
        "data": {
          "source": "sg",
          "space": ["geo", "time"],
          "filter": { "dimensions": { "geo": { "$or": [{ "un_state": true }] } } }
        },
        "encoding": {
          "show": {
            "data": {
              "filter": { "dimensions": { "geo": { "$not": { "is--country": 1, "un_state": 0 } } } }
            }
          },
          "selected": {
            "data": {
              "filter": { "ref": "markers.bubble.encoding.trail.data.filter" }
            }
          },
          "size": {
            "data": {
              "concept": "pop",
              "source": "fasttrack",
            }
          },
          "y": {
            "data": {
              "concept": "lex",
              "source": "fasttrack",
            },
            "scale": {
              "domain": [0, 100],
              "zoomed": [19, 86]
            }
          },
          "x": {
            "data": {
              "concept": "gdp_pcap",
              "source": "fasttrack"
            },
            "scale": {
              "domain": [300, 180000],
              "zoomed": [750, 96000],
              "type": "log"
            }
          },
          "color": {
            "data": {
              "space": ["geo"],
              "concept": "world_4region",
              "constant": null
            },
            "scale": {
              "type": "ordinal"
            }
          },
          "label": {
            "data": {
              "concept": "name"
            }
          },
          "frame": {
            "value": "2023",
            "data": {
              "concept": "time"
            }
          },
          "trail": {
            "groupDim": "time",
            "show": true
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
          "color_map": {
            "data": {
              "space": ["geo"],
              "concept": "landlocked"
            },
            "scale": {
              "type": "ordinal"
            }
          },
        }
      },
      "legend": {
        "encoding": {
          "name": { "data": { "concept": "name" } },
          "order": { "data": { "concept": "name" } },
          "map": { "data": { "concept": "shape_lores_svg" } }
        }
      },
      "legend_map": {
        "encoding": {
          "name": { "data": { "concept": "name" } },
          "order": { "data": { "concept": "name" } },
          "map": { "data": { "concept": null } }
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
      },
      "map": {
        "showBubbles": true,
        "topology": {
          "path": "assets/world-50m.json",
          "objects": {
            "areas": "countries",
            "boundaries": "countries"
          }
        }
      }
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

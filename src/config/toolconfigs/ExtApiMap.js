export const VIZABI_MODEL = {
  model: {
    markers: {
      bubble: {
        requiredEncodings: ["lat", "lon", "size"],
        data: {
          locale: "en",
          source: "sg",
          space: ["geo", "time"],
          filter: {
            dimensions: { "geo": { "$or": [{ "is--country": true }] } }
          }
        },
        encoding: {
          "show": {
            modelType: "selection",
            data: {
              filter: { dimensions: { "geo": { "$not": { "is--country": 1, "un_state": 0 } } } }
            }
          },
          "selected": {
            modelType: "selection"
          },
          "highlighted": {
            modelType: "selection"
          },
          "superhighlighted": {
            modelType: "selection"
          },
          "color": {
            data: {
              space: ["geo"],
              concept: "world_4region"
            },
            scale: {
              modelType: "color",
              type: "ordinal",
              domain: null,
              range: null,
              zoomed: null,
              zeroBaseline: false,
              clamp: false,
              allowedTypes: null
            }
          },
          "color_map": {
            data: {
              concept: "geo",
              space: ["geo"],
            },
            scale: {
              modelType: "color"
            }
          },
          "size": {
            data: {
              concept: "pop",
              source: "fasttrack",
            },
            scale: {
              modelType: "size"
            }
          },
          "label": {
            data: {
              space: ["geo"],
              modelType: "entityPropertyDataConfig",
              concept: "name"
            }
          },
          "size_label": {
            data: {
              constant: "_default"
            },
            scale: {
              modelType: "size",
              extent: [0, 0.34]
            }
          },
          // "centroid": {
          //   data: {
          //     space: ["geo"],
          //     concept: "baskod2010"
          //   }
          // },
          "lat": {
            data: {
              space: ["geo"],
              concept: "latitude"
            }
          },
          "lon": {
            data: {
              space: ["geo"],
              concept: "longitude"
            }
          },
          "frame": {
            modelType: "frame",
            speed: 200,
            value: "2023",
            splash: true,
            data: {
              concept: "time"
            }
          },
        },
      },
      "legend": {
        data: {
          ref: {
            transform: "entityConceptSkipFilter",
            path: "markers.bubble.encoding.color"
          }
        },
        encoding: {
          color: {
            data: {
              concept: { ref: "markers.bubble.encoding.color.data.concept" },
              constant: { ref: "markers.bubble.encoding.color.data.constant" }
            },
            scale: {
              modelType: "color",
              palette: { ref: "markers.bubble.encoding.color.scale.palette" },
              domain: null,
              range: null,
              type: null,
              zoomed: null,
              zeroBaseline: false,
              clamp: false,
              allowedTypes: null
            }
            //scale: { ref: "markers.bubble.encoding.color.scale" }
          },
          name: { data: { concept: "name" } },
          order: {
            modelType: "order",
            direction: "asc",
            data: { concept: "rank" }
          },
          map: { data: { concept: "shape_lores_svg" } }
        }
      },
      "legend_map": {
        data: {
          ref: {
            transform: "entityConceptSkipFilter",
            path: "markers.bubble.encoding.color_map"
          }
        },
        encoding: {
          color: {
            data: {
              concept: { ref: "markers.bubble.encoding.color_map.data.concept" },
              constant: { ref: "markers.bubble.encoding.color_map.data.constant" }
            },
            scale: {
              modelType: "color",
              palette: { ref: "markers.bubble.encoding.color_map.scale.palette" }
            }
            //scale: { ref: "markers.bubble.encoding.color.scale" }
          },
          name: { data: { concept: "name" } },
          rank: { data: { concept: "rank" } },
          map: { data: { concept: "shape_lores_svg" } }
        }
      }
    }
  },
  "ui": {
    //ui
    "buttons": {
      "buttons": ["colors", "markercontrols", "moreoptions", "presentation", "sidebarcollapse", "fullscreen"]
    },
    "dialogs": {
      "dialogs": {
        "popup": ["colors", "markercontrols", "moreoptions"],
        "sidebar": ["colors", "markercontrols", "size", "zoom"],
        "moreoptions": [
          "opacity",
          "speed",
          //"axes",
          "size",
          "colors",
          //"label",
          "mapcolors",
          "mapoptions",
          "technical",
          "presentation",
          "about"
        ]
      },
      "markercontrols": {
        "disableSlice": true,
        "disableAddRemoveGroups": false
      }
    },
    "chart": {
      "opacityRegular": 0.8,
      "opacityHighlightDim": 0.3,
      labels: {
        removeLabelBox: false
      },
      map: {
        overflowBottom: 0,
        topology: {
          path: "assets/world-50m.json",
          objects: {
            areas: "countries",
            boundaries: "countries"
          }
        }
      }
    },
    "tree-menu": {
      "showDataSources": false,
      "folderStrategyByDataset": {
        "sg": "spread",
        "fasttrack": "spread",
        "wdi": "folder:other_datasets"
      }
    }
  }
};

export const VIZABI_MODEL = {
  model: {
    markers: {
      bubble: {
        requiredEncodings: ["color_map"],
        data: {
          locale: "en",
          source: "boendebarom",
          space: ["geo", "year"],
          filter: {
            dimensions: { "geo": { "$or": [{ "is--kommun": true }] } }
          }
        },
        encoding: {
          "show": {
            modelType: "selection",
            data: {
              filter: { dimensions: { "geo": { "$not": { "is--deso": 1 } } } }
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
          "order": {
            modelType: "order",
            direction: "desc",
            data: {
              ref: "markers.bubble.config.encoding.size.data"
            }
          },
          "color": {
            data: {
              constant: "_default"
            },
            scale: {
              modelType: "color",
              type: "ordinal"
            }
          },
          "color_map": {
            data: {
            },
            scale: {
              modelType: "color"
            }
          },
          "size": {
            data: {
            },
            scale: {
              modelType: "size"
            }
          },
          "label": {
            data: {
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
              allowedTypes: ["linear", "log", "genericLog", "pow", "point", "ordinal"],
              extent: [0, 0.34]
            }
          },

          "centroid": {
            data: {
              space: ["geo", "year"],
              concept: "geo"
            }
          },
          // "lat": {
          //   data: {
          //     space: ["geo"],
          //     concept: "latitude"
          //   }
          // },
          // "lon": {
          //   data: {
          //     space: ["geo"],
          //     concept: "longitude"
          //   }
          // },
          "frame": {
            modelType: "frame",
            speed: 200,
            splash: true,
            data: {
              concept: "year"
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
            data: { concept: "name" }
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
    locale: { id: "sv-SE", shortNumberFormat: true },
    layout: { projector: false },
    //ui
    "buttons": {
      "buttons": ["markercontrols", "moreoptions", "presentation", "sidebarcollapse", "fullscreen"]
    },
    "dialogs": {
      "dialogs": {
        "popup": ["markercontrols", "moreoptions"],
        "sidebar": ["markercontrols", "zoom"],
        "moreoptions": [
          "opacity",
          "speed",
          //"axes",
          "size",
          "colors",
          "label",
          "mapcolors",
          "mapoptions",
          "zoom",
          //"technical",
          //"presentation",
          "about"
        ]
      },
      "markercontrols": {
        "disableSlice": true,
        "disableAddRemoveGroups": false,
        "drilldown": "region.kommun.regso",
        "shortcutForSwitch": true,
        "shortcutForSwitch_allow": ["kommun", "regso"],
      }
    },
    "chart": {
      "opacityRegular": 0.8,
      "opacityHighlightDim": 0.3,
      labels: {
        enabled: true,
        dragging: true,
        removeLabelBox: true
      },
      "map": {
        "missingDataColor": false, //"#999" or false for transparent
        "scale": 1,
        "preserveAspectRatio": true,
        "mapEngine": "mapbox",
        "mapStyle": "mapbox://styles/mapbox/light-v9",
        "showBubbles": false,
        "showAreas": true,
        "showMap": true,
        "offset": {
          "top": 0.05,
          "bottom": -0.12,
          "left": 0,
          "right": 0
        },
        "path": null,
        "bounds": {
          west: 4, north: 69, east: 25, south: 56
        },
        "projection": "mercator",
        topology: {
          path: "assets/shapes.json",
          objects: {
            areas: "shapes",
            boundaries: false
          },
          geoIdProperty: "id",
        }
      }
    },
    "data-warning": {
      enable: true
    },
    "tree-menu": {
      "showDataSources": false,
      "folderStrategyByDataset": {
        "kolada": "spread",
        "boendebarom": "spread",
        "wdi": "folder:other_datasets"
      }
    }
  }
};

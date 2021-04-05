VIZABI_MODEL = {
  model: {
    markers: {
      bubble: {
        data: {
          locale: "en",
          source: "sg",
          space: ["country", "time"],
          filter: {
            dimensions: { "country": { "un_state": true } }
          }
        },
        encoding: {
          "selected": {
            modelType: "selection"
          },
          "highlighted": {
            modelType: "selection"
          },
          "size": {
            data: {
              concept: "population_total"
            },
            scale: {
              modelType: "size",
              allowedTypes: ["linear", "log", "genericLog", "pow", "point"]
            }
          },
          "lat": {
            data: {
              space: ["country"],
              concept: "latitude"
            }
          },
          "lon": {
            data: {
              space: ["country"],
              concept: "longitude"
            }
          },
          "color": {
            data: {
              space: ["country"],
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
          "label": {
            data: {
              space: ["country"],
              modelType: "entityPropertyDataConfig",
              concept: "name"
            }
          },
          "size_label": {
            data: {
              constant: "_default"
            },
            scale: {
              modelType: "size"
            }
          },
          "frame": {
            modelType: "frame",
            speed: 200,
            value: "2019",
            data: {
              concept: "time"
            }
          },
          "order": {
              modelType: "order",
              data: {
                ref: "markers.bubble.encoding.size.data",
                direction: "desc"
              }
          },
        },
        requiredEncodings: ["lat", "lon", "size"]
      },
      "legend": {
        data: {
          ref: {
            transform: "entityConceptSkipFilter",
            model: "markers.bubble.encoding.color"
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
          rank: { data: { concept: "rank" } },
          map: { data: { concept: "shape_lores_svg" } }
        }
      }
    }
  },
  ui: {
    locale: { id: "en" },
    layout: { projector: false },

    //ui
    "buttons": {
      "buttons": ["colors", "find", "moreoptions", "presentation", "sidebarcollapse", "fullscreen"]
    },
    "dialogs": {
      "dialogs": {
        "popup": ["colors", "find", "moreoptions"],
        "sidebar": ["colors", "find", "size"],
        "moreoptions": [
          "opacity",
          "speed",
          //"axes",
          "size",
          "colors",
          "label",
          "technical",
          "presentation",
          "about"
        ]
      }
    },
    "chart": {
      showForecast: false,
      showForecastOverlay: true,
      pauseBeforeForecast: true,
      opacityHighlight: 1.0,
      opacitySelect: 1.0,
      opacityHighlightDim: 0.1,
      opacitySelectDim: 0.3,
      opacityRegular: 0.8,
      datawarning: {
        doubtDomain: [],
        doubtRange: []
      },
      labels: {
        enabled: true,
        dragging: true,
        removeLabelBox: false
      },
      superhighlightOnMinimapHover: false,
      map: {
        path: null,
        colorGeo: false,
        preserveAspectRatio: false,
        scale: 1.1,
        offset: {
          top: 0.05,
          right: 0,
          bottom: -0.2,
          left: -0.15
        },
        projection: "geo" + "Aitoff",
        topology: {
          path: "assets/world-50m.json",
          objects: {
            geo: "land",
            boundaries: "countries"
          },
          geoIdProperty: null,
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

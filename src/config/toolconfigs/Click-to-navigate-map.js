export const VIZABI_MODEL = {
  model: {
    markers: {
      bubble: {
        data: {
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
              source: "fasttrack",
              concept: "gapminder_index"
            },
            scale: {
              modelType: "size"
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
              source: "fasttrack",
              concept: "gapminder_index"
            },
            scale: {
              modelType: "color",
              type: "linear",
              domain: [-85, 10],
              range: null,
              zoomed: null,
              zeroBaseline: false,
              clamp: false,
              allowedTypes: null,
              palette: {
                palette: {
                  0: "#3e0693",
                  25: null,
                  31: "#8e25e3",
                  37: "#ae45e8",
                  50: null,
                  62: "#dc5dfd",
                  68: "#feb54c",
                  75: null,
                  89: "#fef14c",
                  100: "#fffce5"
                }
              }
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
              modelType: "size",
              extent: [0, 0.34]
            }
          },
          "frame": {
            modelType: "frame",
            speed: 200,
            value: "2022",
            splash: true,
            data: {
              concept: "time"
            }
          },
          "order": {
            modelType: "order",
            direction: "desc",
            data: {
              ref: "markers.bubble.config.encoding.size.data"
            }
          },
          "repeat": {
            modelType: "repeat",
            allowEnc: ["size"]
          }
        },
        requiredEncodings: ["lat", "lon", "size"]
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
      "sidebarCollapse": true,
      "buttons": ["find"]
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
          "repeat",
          "presentation",
          "about"
        ]
      }
    },
    "chart": {
      timeInBackground: false,
      clickUrl: "https://www.gapminder.org/ignorance/gapminder-index-pilot/?country=",
      showForecast: false,
      showForecastOverlay: true,
      pauseBeforeForecast: true,
      endBeforeForecast: "2022",
      opacityHighlight: 1.0,
      opacitySelect: 1.0,
      opacityHighlightDim: 0.1,
      opacitySelectDim: 0.3,
      opacityRegular: 0,
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
          bottom: -0.07,
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
    "data-warning": {
      doubtDomain: [1800, 1950, 2015],
      doubtRange: [0, 0, 0]
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

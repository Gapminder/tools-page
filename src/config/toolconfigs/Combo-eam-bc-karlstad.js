export const VIZABI_MODEL = {
  model: {
    markers: {
      bubble: {
        requiredEncodings: [],
        data: {
          locale: "en",
          source: "karlstad_demo",
          space: ["geo", "year"],
          filter: {dimensions: {geo: {"$or": [{"is--deso":true}]}}}
        },
        encoding: {
          "selected": {
            modelType: "selection",
            data: {
              filter: {
                ref: "markers.bubble.encoding.trail.data.filter"
              }
            }
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
          "size": {
            data: {
              concept: "befolkning"
            },
            scale: {
              extent: [0, 0.5],
              modelType: "size",
              allowedTypes: ["linear", "log", "genericLog", "pow", "point"]
            }
          },
          "y": {
            data: {
              concept: "ekstand_l_procent",
            },
            scale: {
              allowedTypes: ["linear", "log", "genericLog", "pow", "time"]
            }
          },
          "x": {
            data: {
              concept: "ekstand_h_procent"
            },
            scale: {
              allowedTypes: ["linear", "log", "genericLog", "pow", "time"]
            }
          },
          "color": {
            data: {
              space: ["geo"],
              concept: "region"
            },
            scale: {
              modelType: "color",
              type: "ordinal"
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
          frame: {
            modelType: "frame",
            speed: 200,
            value: "2022",
            splash: true,
            data: {
              concept: "year"
            }
          },
          "trail": {
            modelType: "trail",
            groupDim: "year",
            show: true
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
          "color_map": {
            data: {
              concept: "syssel_procent"
            },
            scale: {
              modelType: "color"
            }
          },
        }
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
  ui: {
    locale: { id: "en" },
    layout: { projector: false },

    //ui
    "buttons": {
      "buttons": ["colors", "markercontrols", "trails", "moreoptions", "presentation", "sidebarcollapse", "fullscreen"]
    },
    "dialogs": {
      "dialogs": {
        "popup": ["colors", "markercontrols", "moreoptions"],
        "sidebar": ["colors", "markercontrols", "mapcolors", "zoom"],
        "moreoptions": [
          "opacity",
          "speed",
          "axes",
          "size",
          "colors",
          "mapcolors",
          "mapoptions",
          "label",
          "zoom",
          "technical",
          "repeat",
          "presentation",
          "about"
        ]
      },
      "markercontrols": {
        "disableAddRemoveGroups": true,
        "primaryDim": "geo",
        "drilldown": "regso"
      }
    },

    "chart": {
      show_ticks: true,
      showForecast: false,
      showForecastOverlay: true,
      pauseBeforeForecast: true,
      endBeforeForecast: "2022",
      opacityHighlight: 1.0,
      opacitySelect: 1.0,
      opacityHighlightDim: 0.1,
      opacitySelectDim: 0.3,
      opacityRegular: 0.8,
      yearInBackground: true,
      yearInTrails: true,
      lockNonSelected: 0,
      numberFormatSIPrefix: true,
      panWithArrow: true,
      adaptMinMaxZoom: false,
      cursorMode: "arrow",
      zoomOnScrolling: true,
      superhighlightOnMinimapHover: true,
      splitVertical: true,
      splitRatio: 0.55,
      whenHovering: {
        showProjectionLineX: true,
        showProjectionLineY: true,
        higlightValueX: true,
        higlightValueY: true
      },
      labels: {
        enabled: true,
        dragging: true,
        removeLabelBox: false
      },
      margin: {
        left: 0,
        top: 0
      },
      decorations: {
        "enabled": true,
        "xAxisGroups": {
          "income_per_person_gdppercapita_ppp_inflation_adjusted": [
            { "min": null, "max": 2650, "label": "incomegroups/level1", "label_short": "incomegroups/level1short" },
            { "min": 2650, "max": 8000, "label": "incomegroups/level2", "label_short": "incomegroups/level2short" },
            { "min": 8000, "max": 24200, "label": "incomegroups/level3", "label_short": "incomegroups/level3short" },
            { "min": 24200, "max": null, "label": "incomegroups/level4", "label_short": "incomegroups/level4short" }
          ]
        }
      },
      "map": {
        "useBivariateColorScaleWithDataFromXY": false,
        "bivariateColorPalette": "BlPu",
        "missingDataColor": "none", //"#999" or "none" for transparent. "none" makes it faster
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
          west: 12.9, north: 59.7, east: 14.1, south: 59.1
        },
        "projection": "mercator",
        topology: {
          path: "assets/shapes-karlstad.json",
          objects: {
            areas: "shapes",
            boundaries: false
          },
          geoIdProperty: "id",
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
        "karlstad_demo": "spread",
        "wdi": "folder:other_datasets"
      }
    }
  }
};

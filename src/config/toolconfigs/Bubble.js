VIZABI_MODEL = {
    model: {
      markers: {
        bubble: {
          requiredEncodings: ["x", "y", "size"],
          data: {
            source: "all",
            space: ["geo", "year"],
            filter: {
              dimensions: {"geo": {"is--commune": 1}}
            }
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
                concept: "population"
              },
              scale: {
                modelType: "size",
                allowedTypes: ["linear", "log", "genericLog", "pow", "point"]
              }
            },
            "y": {
              data: {
                concept: "foreign_nationals_pct",
              },
              scale: {
                allowedTypes: ["linear", "log", "genericLog", "pow", "time"]
              }
            },
            "x": {
              data: {
                concept: "taxable_income_percapita"
              },
              scale: {
                type: "log",
                allowedTypes: ["linear", "log", "genericLog", "pow", "time"]
              }
            },
            "color": {
              data: {
                concept: "social_assistance_rate"
              },
              scale: {
                modelType: "color",
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
                allowedTypes: ["linear", "log", "genericLog", "pow", "point", "ordinal"]
              }
            },
            frame: {
              modelType: "frame",
              speed: 200,
              value: "2019",
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
            "repeat": {
              modelType: "repeat",
              useConnectedRowsAndColumns: false,
              row: ["y"],
              column: ["x"],
              allowEnc: ["y", "x"]
            }
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
            rank: { data: { concept: "rank" } },
            map: { data: { concept: "shape_lores_svg" } }
          }
        },
      }
    },
    ui: {
      locale: { id: "en" },
      layout: { projector: false },
  
      //ui
      "buttons": {
        "buttons": ["colors", "find", "trails", "moreoptions", "presentation", "sidebarcollapse", "fullscreen"]
      },
      "dialogs": {
        "dialogs": {
          "popup": ["colors", "find", "moreoptions"],
          "sidebar": ["colors", "find", "size", "zoom"],
          "moreoptions": [
            "opacity",
            "speed",
            "axes",
            "size",
            "colors",
            "label",
            "zoom",
            "technical",
            "repeat",
            "presentation",
            "about"
          ]
        },
        "find": {
          enableSelectShowSwitch: false,
          enableMarkerSpaceOptions: false,
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
        timeInBackground: false,
        timeInTrails: true,
        lockNonSelected: 0,
        numberFormatSIPrefix: true,
        panWithArrow: false,
        adaptMinMaxZoom: false,
        cursorMode: "arrow",
        zoomOnScrolling: false,
        superhighlightOnMinimapHover: true,
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
          "country_flags": "spread",
          "wdi": "folder:other_datasets"
        }
      }
    }
  };
  
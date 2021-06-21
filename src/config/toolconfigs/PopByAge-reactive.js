VIZABI_MODEL = {
  model: {
    markers: {
      "pyramid": {
        data: {
          source: "pop",
          space: ["geo", "year", "age"],
          filter: {
            dimensions: {
              "geo": {
                "geo": {
                  "$in": ["world"]
                }
              }
            }
          }
        },
        requiredEncodings: ["x"],
        encoding: {
          "selected": {
            modelType: "selection"
          },
          "highlighted": {
            modelType: "selection"
          },
          x: {
            data: {
              concept: "population",
              //space: ['geo','year','age', 'gender'],
              space: ["geo", "year", "age"],
              // space: {
              //   filter: {
              //     concept: { '$eq': ["geo", "year", "age", "gender"] }
              //   }
              // }
            }
          },
          y: {
            data: {
              concept: "age",
              space: ["age"],
            },
            scale: { 
              type: "linear",
              domain: [0,100]}
          },
          "aggregate": {
            modelType: "aggregate",
            data: {
              concept: "population",
              space: ["geo", "year", "age"]
            },
            measures: ["x"],
            grouping: {
              age: {
                grouping: 1
              }
            }
          },
          "order": {
            modelType: "order",
            direction: "desc",
            data: {
              ref: "markers.pyramid.config.encoding.y.data"
            }
          },
          label: {
            data: {
              modelType: "entityPropertyDataConfig",
              concept: "name"
            }
          },
          frame: {
            modelType: "frame",
            value: "2019",
            splash: true,
            data: {
              concept: "year",
              space: ["geo", "year", "age"],
            },
            //interpolate: false
          },
          color: {
            data: {
              space: ["geo"],
              concept: "world_4region"
            },
            scale: {
              modelType: "color",
              type: "ordinal"
            }
          },
          // row: {
          //   data: {
          //     space: ['geo'],
          //     concept: 'geo' }
          //   },
          side: {
            data: {
              //space: ['gender'],
              //concept: 'gender'
              constant: "true",
            }
          },
          facet: {
            modelType: "grouping",
            //modelType: 'facet',
            data: { concept: "geo" },
            rowEncoding: "side",
            columnEncoding: "row"
          }
        }
      },
      "legend": {
        data: {
          ref: {
            transform: "entityConceptSkipFilter",
            path: "markers.pyramid.encoding.color"
          }
        },
        encoding: {
          color: {
            data: {
              concept: { ref: "markers.pyramid.encoding.color.data.concept" },
              constant: { ref: "markers.pyramid.encoding.color.data.constant" }
            },
            scale: {
              modelType: "color",
              palette: { ref: "markers.pyramid.encoding.color.scale.palette" },
              domain: null,
              range: null,
              type: null,
              zoomed: null,
              zeroBaseline: false,
              clamp: false,
              allowedTypes: null
            }
          },
          name: { data: { concept: "name" } },
          rank: { data: { concept: "rank" } },
          map: { data: { concept: "shape_lores_svg" } }
        }
      },
    }
  },
  ui: {
    //ui
    chart: {
      mode: "smallMultiples",
      stacked: true,
      inpercent: false,
      flipSides: true,
      lockActive: true,
      lockNonSelected: 0,

      showForecast: true,
      showForecastOverlay: false,
      pauseBeforeForecast: false,
      endBeforeForecast: "2020",

    },
    "buttons": {
      "buttons": ["colors", "find", "lock", /*"side",*/ "inpercent", "moreoptions", "sidebarcollapse", "fullscreen"]
    },
    "dialogs": {
      "dialogs": {
        "popup": ["timedisplay", "colors", "find", /*"side",*/ "moreoptions"],
        "sidebar": ["timedisplay", "colors", "find", "grouping"],
        "moreoptions": ["opacity", "speed", "grouping", "colors", /*"side",*/ "presentation", "about"],
      },
      "find": {
        "panelMode": "show",
        "showTabs": {
          "geo": "open fully"
        },
        enablePicker: false
      }
    },
    presentation: false
  }
};

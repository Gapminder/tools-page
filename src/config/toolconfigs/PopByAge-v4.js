export const VIZABI_MODEL = {
  model: {
    markers: {
      "pyramid": {
        data: {
          source: "pop",
          space: ["geo", "year", "age"],
          filter: {
            dimensions: {
              "geo": {
                "$or": [{
                  "geo": { $in: ["world"] }
                }]
              }
            }
          }
        },
        requiredEncodings: ["x"],
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
              domain: [0, 100] }
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
          "orderFacets": {
            modelType: "order",
            direction: { ref: "markers.pyramid.data.filter.config.dimensions.geo.$or.0.geo.$in" },
            data: { ref: "markers.pyramid.encoding.facet_column.data" }
          },
          label: {
            data: {
              modelType: "entityPropertyDataConfig",
              concept: "name"
            }
          },
          frame: {
            modelType: "frame",
            value: "2023",
            playbackSteps: 1,
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
          side: {
            data: {
              //space: ['gender'],
              //concept: 'gender'
              constant: "true",
            }
          },
          stack: {
            data: {
              //concept: "education_level" or whatever
              constant: "true",
            }
          },
          "repeat": {
            modelType: "repeat",
            allowEnc: ["x"]
          },
          "facet_column": {
            data: {
              //set space and concept
              //or constant="none" or magic concept="is--" with possible exceptions
              modelType: "entityMembershipDataConfig",
              space: ["geo"],
              constant: null,
              //concept: "world_4region"
              concept: "geo",
              //exceptions: {"is--country": "geo"}
            }
          },
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
          order: {
            modelType: "order",
            direction: "asc",
            data: { concept: "rank" }
          },
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
      endBeforeForecast: "2023",

    },
    "buttons": {
      "buttons": ["colors", "markercontrols", "lock", /*"side",*/ "inpercent", "moreoptions", "sidebarcollapse", "fullscreen"]
    },
    "dialogs": {
      "dialogs": {
        "popup": ["timedisplay", "colors", "markercontrols", /*"side",*/ "moreoptions"],
        "sidebar": ["timedisplay", "colors", "markercontrols", "grouping"],
        "moreoptions": ["opacity", "speed", "grouping", "colors", /*"side",*/ "presentation", "about"],
      },
      "markercontrols": {
        "disableSwitch": true,
        "disableSlice": true,
        "disableAddRemoveGroups": true,
        "disableFindInteractions": true,
        "primaryDim": "geo"
      }
    },
    presentation: false
  }
};

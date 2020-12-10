

VIZABI_MODEL = {
  model: {
    markers: {
      line: {
        requiredEncodings: ["x", "y"],
        data: {
          locale: "en",
          source: "energy",
          space: ["flow", "geo", "product", "year"],
          filter: { "dimensions": {
            geo: { geo: { "$in": ["world"] } },
            flow: { flow: { "$in": ["production"] } },
            product: { product: { "$in": [
              "memo_primary_and_secondary_oil",
              "memo_coal_peat_and_oil_shale",
              "natural_gas",
              "memo_renewables",
              "nuclear",
              "biofuels_and_waste"
            ] } }
          } }
        },
        encoding: {
          "selected": {
            modelType: "selection"
          },
          "highlighted": {
            modelType: "selection"
          },
          "y": {
            data: {
              concept: "value"
            },
            scale: {
              type: "linear",
              domain: [0, 41845973]
            }
          },
          "x": {
            data: {
              concept: {
                autoconfig: {
                  concept_type: "time"
                }
              }
            },
            scale: {
              type: "time",
              domain: ["1971", "2017"]
            }
          },
          "color": {
            data: {
              space: ["product"],
              concept: "product"
            },
            scale: {
              modelType: "color",
              type: "ordinal",
              domain: null,
              range: null,
              zoomed: null,
              palette: {
                palette: {
                  "coal_and_coal_products": "#3366cc",
                  "peat_and_peat_products": "#dc3912",
                  "oil_shale_and_oil_sands": "#ff9900",
                  "crude_ngl_and_feedstocks": "#109618",
                  "oil_products": "#990099",
                  "natural_gas": "#4F4F4F",
                  "nuclear": "#ADC58E",
                  "hydro": "#66aa00",
                  "geothermal": "#b82e2e",
                  "solar_wind_other": "#316395",
                  "biofuels_and_waste": "#ADC58E",
                  "heat_production_from_non_specified_combustible_fu": "#22aa99",
                  "electricity": "#aaaa11",
                  "heat": "#6633cc",
                  "total": "#e67300",
                  "memo_renewables": "#ADC58E",
                  "memo_coal_peat_and_oil_shale": "#101010",
                  "memo_primary_and_secondary_oil": "#373737",
                  "memo_geothermal_solar_wind_other_heat_electricity": "#5574a6"
                }
              }
            }
          },
          "label": {
            data: {
              space: ["product"],
              concept: "name"
            }
          },
          frame: {
            modelType: "frame",
            speed: 200,
            data: {
              concept: {
                autoconfig: {
                  concept_type: "time"
                }
              }
            }
          }
        }
      },
      "legend": {
        data: {
          ref: {
            transform: "entityConceptSkipFilter",
            model: "markers.line.encoding.color"
          }
        },
        encoding: {
          color: {
            data: {
              concept: { ref: "markers.line.encoding.color.data.concept" },
              constant: { ref: "markers.line.encoding.color.data.constant" }
            },
            scale: {
              modelType: "color",
              type: "ordinal",
              domain: null,
              range: null,
              zoomed: null,
              palette: { ref: "markers.line.encoding.color.scale.palette" }
            }
            //scale: { ref: "markers.line.encoding.color.scale" }
          },
          name: { data: { concept: "name" } },
          rank: { data: { constant: 0 } }
        }
      }
    }
  },
  ui: {
    "time-slider": {
      "show_value": true
    },
    "buttons": {
      "buttons": ["presentation"]
    },
    "dialogs": {
      "dialogs": {
        "popup": [],
        "sidebar": [],
        "moreoptions": []
      },
      "find": {
        "panelMode": "show",
        "showTabs": {
        }
      }
    }
    // "buttons": {
    //   "buttons": ["find", "colors", "moreoptions", "presentation", "sidebarcollapse", "fullscreen"],
    // },
    // "dialogs": {
    //   "dialogs": {
    //     "popup": ["colors", "find", "moreoptions"],
    //     "sidebar": ["colors", "find"],
    //     "moreoptions": ["opacity", "colors", "speed", "axes", "presentation", "about"]
    //   },
    //   "find": {
    //     "panelMode": "show",
    //     "showTabs": {
    //     }
    //   }
    // }
  }
};

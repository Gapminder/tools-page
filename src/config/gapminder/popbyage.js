export const VIZABI_MODEL = {
    "model": {
      "markers": {
        "pyramid": {
          "data": {
            "source": "pop",
            "space": ["geo", "year", "age"],
            "filter": { "dimensions": { "geo": { "$or": [{ "geo": { "$in": ["americas","europe","africa","asia"] } }] } } }

          },
          "encoding": {
            "show": {
              "data": {
                "filter": { "dimensions": { "geo": { "$not": { "is--country": 1, "un_state": 0 } } } }
              }
            },
            "x": {
              "data": { "concept": "population" }
            },
            "y": {
              "data": {
                "concept": "age",
                "space": ["age"]
              },
              "scale": {
                "domain": [0, 100] 
              }
            },
            "aggregate": {
              "grouping": {
                "age": { "grouping": 1 }
              }
            },
            "orderFacets": {
              "direction": { "ref": "markers.pyramid.data.filter.config.dimensions.geo.$or.0.geo.$in" },
              "data": { "ref": "markers.pyramid.encoding.facet_column.data" }
            },
            "label": {
              "data": { "concept": "name" }
            },
            "frame": {
              " //": "playbackSteps changes w aggregation, also 'interpolate: false' is some possible exotic customisation",
              "value": "2024",
              "playbackSteps": 1,
              "data": { "concept": "year" }
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
            "side": {
              "data": {
                "constant": "true",
                " //": "alternatively, set space: [gender] and concept: gender"
              },
              "defaultConcept": "gender"
            },
            "facet_column": {
              "data": {
                "space": ["geo"],
                "constant": null,
                "concept": "geo",
                " //1": "alternatively, set constant='none' or magic concept='is--' with possible exceptions",
                " //2": "concept: world_4region",
                " //3": "exceptions: {is--country: geo}"
              }
            }
          }
        },
        "legend": {
          "encoding": {
            "name": { "data": { "concept": "name" } },
            "order": { "data": { "concept": "rank" } },
            "map": { "data": { "concept": "shape_lores_svg" } }
          }
        }
      }
    },
    "ui": {
      "locale": { "id": "en", "shortNumberFormat": true },
      "layout": { "projector": false },

      "chart": {
        "endBeforeForecast": "2024"
      },
      "buttons": {
        "buttons": ["colors", "markercontrols", "lock", "sided","inpercent", "moreoptions", "sidebarcollapse", "fullscreen"]
      },
      "dialogs": {
        "markercontrols": {
        },
        "tree-menu": {
          "folderStrategyByDataset": {
            "pop": "spread"
          }
        }
      }
    }
  };
  
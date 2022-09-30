VIZABI_MODEL = {
  model: {
    markers: {
      bubble: {
        data: {
          locale: "en",
          source: "sodertorn",
          space: ["municipality", "year"],
        },
        encoding: {
          "selected": {
            modelType: "selection"
          },
          "highlighted": {
            modelType: "selection"
          },
          "color": {
            data: {
              concept: "mean_income_aged_gt_20"
            },
            scale: {
              modelType: "color",
              type: "log"
            }
          },
          "color_map": {
            data: {
              concept: "municipality",
              space: ["municipality"],
            },
            scale: {
              modelType: "color"
            }
          },
          "size": {
            data: {
              concept: "population_20xx_12_31"
            },
            scale: {
              modelType: "size"
            }
          },
          "label": {
            data: {
              space: ["municipality"],
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
          "centroid": {
            data: {
              space: ["municipality"],
              concept: "baskod2010"
            }
          },
          "frame": {
            modelType: "frame",
            speed: 200,
            value: 2014,
            data: {
              concept: "year"
            }
          },
        },
        requiredEncodings: ["centroid", "size"]
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
              palette: { ref: "markers.bubble.encoding.color.scale.palette" }
            }
            //scale: { ref: "markers.bubble.encoding.color.scale" }
          },
          name: { data: { concept: "name" } },
          rank: { data: { concept: "rank" } },
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
      "buttons": ["colors", "find", "moreoptions", "presentation", "sidebarcollapse", "fullscreen"]
    },
    "dialogs": {
      "dialogs": {
        "popup": ["colors", "find", "moreoptions"],
        "sidebar": ["colors", "find", "size", "zoom"],
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
      }
    },
    "chart": {
      "opacityRegular": 0.8,
      "opacityHighlightDim": 0.3,
      labels: {
        removeLabelBox: false
      }
    }
  }
}


/*
  "state": {
    "time": {
      "startOrigin": "1993",
      "endOrigin": "2015",
      "value": "2014",
      "dim": "year",
      "delay": 700
    },
    "entities": {
      "dim": "basomrade",
      "show": {"size": "big"}
    },
    "entities_colorlegend": {
      "dim": "municipality"
    },
    "entities_map_colorlegend": {
      "dim": "municipality"
    },
    "marker": {
      "space": ["entities", "time"],
      "label": {
        "use": "property",
        "which": "name"
      },
      "hook_centroid": {
        "use": "property",
        "which": "baskod2010",
        "_important": true
      },
      "size": {
        "which": "population_20xx_12_31",
        "use": "indicator",
        "scaleType": "linear",
        "extent": [0, 0.4],
        "allow": {
          "scales": ["linear"]
        }
      },
      "color": {
        "use": "indicator",
        "which": "mean_income_aged_gt_20",
        "scaleType": "log",
        "syncModels": ["marker_colorlegend"]
      },
      "color_map": {
        "use": "property",
        "which": "municipality",
        "scaleType": "ordinal",
        "syncModels": ["marker_colorlegend"]
      }
    },
    "marker_allpossible": {
      "space": ["entities"],
      "label": {
          "use": "property",
          "which": "name"
      },
      "skipFilter": true
    },
    "marker_colorlegend": {
      "space": ["entities_colorlegend"],
      "opacityRegular": 0.8,
      "opacityHighlightDim": 0.3,
      "label": {
        "use": "property",
        "which": "name"
      },
      "hook_rank": {
        "use": "property",
        "which": "rank"
      },
      "hook_geoshape": {
        "use": "property",
        "which": "shape_lores_svg"
      }
    }
  },
  "ui": {
    "datawarning": {
      "doubtDomain": [1993, 2015],
      "doubtRange": [0, 0]
    },
    "map": {
      "scale": 1,
      "preserveAspectRatio": true,
      "mapEngine": "mapbox",
      "mapStyle": "mapbox://styles/mapbox/light-v9",
      "showBubbles": true,
      "showAreas": false,
      "showMap": true,
      "offset": {
        "top": 0.05,
        "bottom": -0.12,
        "left": 0,
        "right": 0
      },
      "path": null,
      "bounds": {
        "north": 59.48,
        "west": 17.72,
        "south": 59.21,
        "east": 18.32
      },
      "projection": "mercator",
      "topology": {
        "path": "assets/sodertorn-basomr2010.json",
        "objects": {
          "geo": "c1e171fae817c0bfc26dc7df82219e08",
          "boundaries": "c1e171fae817c0bfc26dc7df82219e08"
        },
        "geoIdProperty": "BASKOD2010"
      }
    },
    "splash": true
  },
  "data": {
    "reader": 'ddf',
    "path": "https://raw.githubusercontent.com/open-numbers/ddf--sodertornsmodellen/master/",
  }
};
*/

export const VIZABI_MODEL = {
  "model": {
    "presets": [
      [{
        "icon": "show_countries--stack_none--facet_none",
        "mode": "show",
        "loosePath": ["geo", "$or", 0, "geo", "$in"],
        "config": {
          "data": {
            "filter": {
              "dimensions": { 
                "geo": { 
                  "$or": [{
                    "geo": { "$in": ["usa", "chn", "rus", "nga"] } 
                  }]
                }
              }
            }
          },
          "encoding": {
            "order": { "direction": "asc", "data": { "concept": null, "constant": "none" } },
            "stack": { "data": { "constant": "none" } },
            "facet_row": { "data": { "constant": "none" } }
          }
        }
      }, {
        "icon": "show_countries--stack_region--facet_none",
        "mode": "select",
        "config": {
          "data": {
            "filter": { "dimensions": { "geo": { "$or": [{ "un_state": true }] } } }
          },
          "encoding": {
            "order": {"direction": "asc", "data": { "concept": null, "constant": "none" } },
            "stack": { "data": { "ref": "markers.mountain.config.encoding.color.data" } },
            "facet_row": { "data": { "constant": "none" } }
          }
        }
      }, {
        "icon": "show_regions--stack_none--facet_none",
        "mode": "none",
        "groupPath": ["geo", "$or"],
        "config": {
          "data": {
            "filter": { "dimensions": { "geo": { "$or": [{ "is--world_4region": true }]} } }
          },
          "encoding": {
            "order": { "direction": "asc", "data": { "concept": null, "constant": "none" } },
            "stack": { "data": { "constant": "none" } },
            "facet_row": { "data": { "constant": "none" } }
          }
        }
      }],


      [{
        "icon": "show_countries--stack_all--facet_none",
        "mode": "select",
        "config": {
          "data": {
            "filter": { "dimensions": { "geo": { "$or": [{ "un_state": true }] } } }
          },
          "encoding": {
            "order": { "direction": "asc", "data": { "concept": null, "constant": "none" } },
            "stack": { "data": { "constant": "all" } },
            "facet_row": { "data": { "constant": "none" } }
          }
        }
      }, {
        "icon": "show_regions--stack_all--facet_none",
        "mode": "none",
        "groupPath": ["geo", "$or"],
        "config": {
          "data": {
            "filter": { "dimensions": { "geo": { "$or": [{ "is--world_4region": true }]} } }
          },
          "encoding": {
            "order": { "direction": "asc", "data": { "concept": null, "constant": "none" } },
            "stack": { "data": { "constant": "all" } },
            "facet_row": { "data": { "constant": "none" } }
          }
        }
      }, {
        "icon": "show_world--stack_all--facet_none",
        "mode": "none",
        "config": {
          "data": {
            "filter": { "dimensions": { "geo": { "$or": [{ "is--global": true } ] } } }
          },
          "encoding": {
            "order": { "direction": "asc", "data": { "concept": null, "constant": "none" } },
            "stack": { "data": { "constant": "all" } },
            "facet_row": { "data": { "constant": "none" } }
          }
        }
      }],


      [{
        "icon": "show_geo--stack_all--facet_isness",
        "mode": "show",
        "loosePath": ["geo", "$or", 0, "geo", "$in"],
        "config": {
          "data": {
            "filter": { 
              "dimensions": { 
                "geo": {
                  "$or": [{
                    "geo": { "$in": ["africa", "americas", "asia", "europe"] }
                  }]
                } 
              }
            }
          },
          "encoding": {
            "order": {
              "direction": { "ref": {
                "path": "markers.mountain.data.filter",
                "transform": "orderDirection"
              }},
              "data": { "constant": null, "concept": "geo" }
            },
            "stack": { "data": { "constant": "all" } },
            "facet_row": { "data": { "concept": "is--", "exceptions": { "is--country": "geo" }, "space": ["geo"] } }
          }
        }
      }, {
        "icon": "show_regions--stack_all--facet_regions",
        "mode": "none",
        "groupPath": ["geo", "$or"],
        "config": {
          "data": {
            "filter": { "dimensions": { "geo": { "$or": [{ "is--world_4region": true }]} } }
          },
          "encoding": {
            "order": { "direction": "asc", "data": { "concept": "rank", "constant": null } },
            "stack": { "data": { "constant": "all" } },
            "facet_row": { "data": { "ref": "markers.mountain.config.encoding.color.data" } }
          }
        }
      }, {
        "icon": "show_countries--stack_all--facet_regions",
        "mode": "select",
        "config": {
          "data": {
            "filter": { "dimensions": { "geo": { "$or": [{ "un_state": true }] } } }
          },
          "encoding": {
            "order": { "direction": "asc", "data": { "concept": "rank", "constant": null } },
            "stack": { "data": { "constant": "all" } },
            "facet_row": { "data": { "ref": "markers.mountain.config.encoding.color.data" } }
          }
        }
      }]
    ],
    "markers": {
      "mountain": {
        "data": {
          "source": "povcalnet",
          "space": ["geo", "time"],
          "filter": {
            "dimensions": {
              "geo": { 
                "$or": [{
                  "geo": { "$in": ["africa", "americas", "asia", "europe"]}
                }]
              }
              //"geo": { "is--world_4region": true }
              //"geo": { "is--country": true }
              //"geo": { "un_state": true }
              //"geo": { "$or": [
              //  { "is--world_4region": true },
              //   { "is--west_and_rest": true },
              //   { "un_state": true },
              //   { "is--global": true }
              //] }
              //"geo": { "geo": {"$in": ["asia", "africa", "chn"]}},
              //"time": {"time": "2023"}
            }
          }
        },
        "requiredEncodings": ["shapedata", "facet_row"],
        "encoding": {
          "show": {
            "modelType": "selection",
            "data": {
              "filter": { "dimensions": { "geo": { "$not": { "is--country": 1, "un_state": 0 } } } }
            }
          },
          "order": {
            "modelType": "order",
            "direction": { "ref": {
              "path": "markers.mountain.data.filter",
              "transform": "orderDirection"
            }},
            "data": { "constant": null, "concept": "geo" }
          },
          "selected": {
            "modelType": "selection"
          },
          "highlighted": {
            "modelType": "selection"
          },
          "shapedata": {
            "data": {
              "concept": "income_mountain_50bracket_shape_for_log"
            }
          },
          "mu": {
            "data": {
              "constant": 0
            },
            "scale": {
              "type": "log",
              "domain": [0.11, 500]
            },
            "tailFatX": 2.15,
            "tailCutX": 0.2,
            "tailFade": 0.7,
            "xScaleFactor": 1,
            "xScaleShift": 0
          },
          "color": {
            "data": {
              "space": ["geo"],
              "concept": "world_4region",
              allow: {
                "concept": {
                  "filter": { "concept_type": { "$nin": ["measure", "string"] } }
                }
              }
            },
            "scale": {
              "modelType": "color",
              "type": "ordinal"
            }
          },
          "stack": {
            "data": {
              "constant": "all",
              "space": null,
              "concept": null
            },
            "merge": false
          },
          "group": {
            "data": { "ref": "markers.mountain.config.encoding.color.data" },
            "merge": false,
            "manualSorting": []
          },
          "label": {
            "data": {
              "modelType": "entityPropertyDataConfig",
              "concept": "name"
            }
          },
          "frame": {
            "value": "2023",
            "modelType": "frame",
            "speed": 200,
            "splash": true,
            "data": {
              "concept": "time"
            }
          },
          "repeat": {
            "modelType": "repeat",
            "allowEnc": ["shapedata"]
          },
          "facet_row": {
            "data": {
              //set space and concept
              //or constant="none" or magic concept="is--" with possible exceptions
              "modelType": "entityMembershipDataConfig",
              "space": ["geo"],
              "constant": null,
              //concept: "world_4region"
              "concept": "is--",
              "exceptions": { "is--country": "geo" }
            }
          },
          "maxheight": {
            "limit": 966980928,
            "data": {
              "space": ["geo"],
              "concept": "income_mountain_50bracket_max_height_for_log"
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
      },
      "povertyline": {
        "encoding": {
          "povertyline": {
            "data": {
              "concept": "poverty_line"
            }
          }
        }
      },
      "billy": {
        "data": {
          "space": ["person", "time"],
          "source": "billy"
        },
        "encoding": {
          "x": {
            "data": {
              "space": ["person", "time"],
              "concept": null,
              "stash": "daily_income"
            }
          },
          "name": {
            "data": {
              "space": ["person"],
              "concept": null,
              "stash": "name"
            }
          },
          "slices": {
            "data": {
              "space": ["person"],
              "concept": null,
              "stash": "country"
            }
          },
          "frame": {
            "value": "2023",
            "data": {
              "concept": "time"
            }
          }
        }
      }
    }
  },
  "ui": {
    "locale": { "id": "en", "shortNumberFormat": true },
    "layout": { "projector": false },

    "chart": {
      "decorations": {
        "enabled": true,
        "xAxisGroups": {
          "any": [
            { "min": null, "max": 3, "label": "incomegroups/level1", "label_short": "incomegroups/level1short" },
            { "min": 3, "max": 12, "label": "incomegroups/level2", "label_short": "incomegroups/level2short" },
            { "min": 12, "max": 48, "label": "incomegroups/level3", "label_short": "incomegroups/level3short" },
            { "min": 48, "max": 192, "label": "incomegroups/level4", "label_short": "incomegroups/level4short" },
            { "min": 192, "max": 768, "label": "incomegroups/level5", "label_short": "incomegroups/level5short" },
            { "min": 768, "max": 3072, "label": "incomegroups/level6", "label_short": "incomegroups/level6short" },
            { "min": 3072, "max": 12288, "label": "incomegroups/level7", "label_short": "incomegroups/level7short" },
            { "min": 12288, "max": 49152, "label": "incomegroups/level8", "label_short": "incomegroups/level8short" },
            { "min": 49152, "max": 196608, "label": "incomegroups/level9", "label_short": "incomegroups/level9short" },
            { "min": 196608, "max": 786432, "label": "incomegroups/level10", "label_short": "incomegroups/level10short" },
            { "min": 786432, "max": 3145728, "label": "incomegroups/level11", "label_short": "incomegroups/level11short" },
            { "min": 3145728, "max": 12582912, "label": "incomegroups/level12", "label_short": "incomegroups/level12short" },
            { "min": 12582912, "max": 50331648, "label": "incomegroups/level13", "label_short": "incomegroups/level13short" },
            { "min": 50331648, "max": 201326592, "label": "incomegroups/level14", "label_short": "incomegroups/level14short" },
            { "min": 201326592, "max": 805306368, "label": "incomegroups/level15", "label_short": "incomegroups/level15short" },
          ]
        }
      },
      "dsShow": false,
      "dsHowManyHomes": 10,
      "dsTopic": "homes",
      "showBilly": false,
      "billyFaces": true,
      "howManyBilly": 10,
      "billyYScale": 0.5,
      "billyMeshXPoints": 86,
      "inpercent": true,
      "timeInBackground": true,
      "curve": "curveBasis",
      "showForecastOverlay": true,
      "showForecast": false,
      "pauseBeforeForecast": true,
      "endBeforeForecast": "2023",
      "opacityHighlight": 1.0,
      "opacitySelect": 1.0,
      "opacityHighlightDim": 0.1,
      "opacitySelectDim": 0.3,
      "opacityRegular": 0.8,
      "yMaxMethod": 1,
      "showProbeX": true,
      "probeX": 3,
      "probeXCustom": 4,
      "probeXType": "extreme",
      "probeXDetails": {
        "belowProc": true,
        "belowCount": false,
        "aboveProc": false,
        "aboveCount": false
      },
      "ultrarich": {
        "opacityHighlight": 1.0,
        "opacitySelect": 1.0,
        "opacityHighlightDim": 0.1,
        "opacitySelectDim": 0.3,
        "opacityRegular": 1.0,
      }
    },
    "data-warning": {
      "doubtDomain": [1800, 1950, 2020],
      "doubtRange": [0, 0, 0]
    },
    "time-slider": {
      "show_value": false
    },
    "buttons": {
      "buttons": ["colors", "markercontrols", "inpercent", "moreoptions", "presentation", "sidebarcollapse", "fullscreen"],
    },
    "dialogs": {
      "dialogs": {
        "popup": ["presets", "colors", "markercontrols", "billy", "dollarstreet", "moreoptions"],
        "sidebar": ["presets", "colors", "markercontrols", "dollarstreet"],
        "moreoptions": ["opacity", "speed", "colors", "stack", "billy", "dollarstreet", "povertyline", "technical", "presentation", "about"]
      },
      "find": {
        "enableSelectShowSwitch": false,
        "panelMode": "find",
        "showTabs": {
          "geo": "open"
        }
      },
      "markercontrols": {
        "disableSwitch": true,
        "disableSlice": true,
        "disableAddRemoveGroups": true
      }
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

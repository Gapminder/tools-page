VIZABI_MODEL = {
  model: {
    presets: [
      [{
        icon: "show_countries--stack_none--facet_none",
        mode: "show",
        loosePath: ["geo", "geo", "$in"],
        config: {
          data: {
            filter: { dimensions: { "geo": { "geo": { $in: ["usa", "chn", "rus", "nga"] } } } }
          },
          encoding: {
            stack: { data: { constant: "none" } },
            facet_row: { data: { constant: "none" } }
          }
        }
      }, {
        icon: "show_countries--stack_region--facet_none",
        mode: "select",
        config: {
          data: {
            filter: { dimensions: { "geo": { "un_state": true } } }
          },
          encoding: {
            stack: { data: { ref: "markers.mountain.config.encoding.color.data" } },
            facet_row: { data: { constant: "none" } }
          }
        }
      }, {
        icon: "show_regions--stack_none--facet_none",
        mode: "none",
        groupPath: ["geo"],
        config: {
          data: {
            filter: { dimensions: { "geo": { "is--world_4region": true } } }
          },
          encoding: {
            stack: { data: { constant: "none" } },
            facet_row: { data: { constant: "none" } }
          }
        }
      }],


      [{
        icon: "show_countries--stack_all--facet_none",
        mode: "select",
        config: {
          data: {
            filter: { dimensions: { "geo": { "un_state": true } } }
          },
          encoding: {
            stack: { data: { constant: "all" } },
            facet_row: { data: { constant: "none" } }
          }
        }
      }, {
        icon: "show_regions--stack_all--facet_none",
        mode: "none",
        groupPath: ["geo"],
        config: {
          data: {
            filter: { dimensions: { "geo": { "is--world_4region": true } } }
          },
          encoding: {
            stack: { data: { constant: "all" } },
            facet_row: { data: { constant: "none" } }
          }
        }
      }, {
        icon: "show_world--stack_all--facet_none",
        mode: "none",
        config: {
          data: {
            filter: { dimensions: { "geo": { "is--global": true } } }
          },
          encoding: {
            stack: { data: { constant: "all" } },
            facet_row: { data: { constant: "none" } }
          }
        }
      }],


      [{
        icon: "show_geo--stack_all--facet_isness",
        mode: "show",
        loosePath: ["geo", "geo", "$in"],
        config: {
          data: {
            filter: { dimensions: { "geo": {"geo": { "$in": ["africa", "americas", "asia", "europe"] } } } }
          },
          encoding: {
            stack: { data: { constant: "all" } },
            facet_row: { data: { concept: "is--", exceptions: { "is--country": "geo" }, space: ["geo"] } }
          }
        }
      }, {
        icon: "show_regions--stack_all--facet_regions",
        mode: "none",
        groupPath: ["geo"],
        config: {
          data: {
            filter: { dimensions: { "geo": { "is--world_4region": true } } }
          },
          encoding: {
            stack: { data: { constant: "all" } },
            facet_row: { data: { ref: "markers.mountain.config.encoding.color.data" } }
          }
        }
      }, {
        icon: "show_countries--stack_all--facet_regions",
        mode: "select",
        config: {
          data: {
            filter: { dimensions: { "geo": { "un_state": true } } }
          },
          encoding: {
            stack: { data: { constant: "all" } },
            facet_row: { data: { ref: "markers.mountain.config.encoding.color.data" } }
          }
        }
      }],
    ],
    markers: {
      "mountain": {
        data: {
          source: "povcalnet",
          space: ["geo", "time"],
          filter: {
            dimensions: {
              "geo": { "geo": {"$in": ["africa", "americas", "asia", "europe"]}}
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
              //"time": {"time": "2022"}
            }
          }
        },
        requiredEncodings: ["shapedata", "facet_row"],
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
          "shapedata": {
            data: {
              concept: "income_mountain_50bracket_shape_for_log"
            }
          },
          "mu": {
            data: {
              constant: 0
            },
            scale: {
              type: "log",
              domain: [0.11, 500]
            },
            "tailFatX": 2.15,
            "tailCutX": 0.2,
            "tailFade": 0.7,
            "xScaleFactor": 1,
            "xScaleShift": 0
          },
          "color": {
            data: {
              space: ["geo"],
              concept: "world_4region"
            },
            "scale": {
              modelType: "color",
              type: "ordinal",
              allowedTypes: ["ordinal"]
            }
          },
          "stack": {
            data: {
              constant: "all",
              space: null,
              concept: null
            },
            "merge": false
          },
          "group": {
            data: { ref: "markers.mountain.config.encoding.color.data" },
            "merge": false,
            "manualSorting": []
          },
          "label": {
            data: {
              modelType: "entityPropertyDataConfig",
              concept: "name"
            }
          },
          frame: {
            value: "2022",
            modelType: "frame",
            speed: 200,
            splash: true,
            data: {
              concept: "time"
            }
          },
          "repeat": {
            modelType: "repeat",
            allowEnc: ["shapedata"]
          },
          "facet_row": {
            data: {
              //set space and concept
              //or constant="none" or magic concept="is--" with possible exceptions
              modelType: "entityMembershipDataConfig",
              space: ["geo"],
              constant: null,
              //concept: "world_4region"
              concept: "is--",
              exceptions: { "is--country": "geo" }
            }
          },
          "maxheight": {
            limit: 966980928,
            data: {
              space: ["geo"],
              concept: "income_mountain_50bracket_max_height_for_log"
            }
          }
        }
      },
      "legend": {
        data: {
          ref: {
            transform: "entityConceptSkipFilter",
            path: "markers.mountain.encoding.color"
          }
        },
        encoding: {
          color: {
            data: {
              concept: { ref: "markers.mountain.encoding.color.data.concept" },
              constant: { ref: "markers.mountain.encoding.color.data.constant" }
            },
            scale: {
              modelType: "color",
              palette: { ref: "markers.mountain.encoding.color.scale.palette" },
              type: null,
              domain: null,
              range: null,
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
      povertyline: {
        data: {
          ref: "markers.mountain.config.data"
        },
        encoding: {
          povertyline: {
            data: {
              concept: "poverty_line"
            }
          }
        }
      },
      billy: {
        data: {
          space: ["person", "time"],
          source: "billy"
        },
        requiredEncodings: ["x"],
        encoding: {
          "order": {
            modelType: "order",
            direction: "desc",
            data: {
              ref: "markers.billy.config.encoding.x.data"
            }
          },
          x: {
            data: {
              space: ["person", "time"],
              concept: null,
              stash: "daily_income"
            }
          },
          name: {
            data: {
              space: ["person"],
              concept: null,
              stash: "name"
            }
          },
          slices: {
            data: {
              space: ["person"],
              concept: null,
              stash: "countries"
            }
          },
          frame: {
            value: "2022",
            modelType: "frame",
            loop: false,
            data: {
              concept: "time"
            },
            scale: {
              clampDomainToData: true
            }
          },
          selected: {
            modelType: "selection"
          },
          highlighted: {
            modelType: "selection"
          }
        }
      }
    }
  },
  ui: {
    locale: { id: "en" },
    layout: { projector: false },

    //ui
    "chart": {
      "decorations": {
        "enabled": true,
        "xAxisGroups": {
          "any": [
            { "min": null, "max": 2, "label": "incomegroups/level1", "label_short": "incomegroups/level1short" },
            { "min": 2, "max": 8, "label": "incomegroups/level2", "label_short": "incomegroups/level2short" },
            { "min": 8, "max": 32, "label": "incomegroups/level3", "label_short": "incomegroups/level3short" },
            { "min": 32, "max": 128, "label": "incomegroups/level4", "label_short": "incomegroups/level4short" },
            { "min": 128, "max": 512, "label": "incomegroups/level5", "label_short": "incomegroups/level5short" },
            { "min": 512, "max": 2048, "label": "incomegroups/level6", "label_short": "incomegroups/level6short" },
            { "min": 2048, "max": 8192, "label": "incomegroups/level7", "label_short": "incomegroups/level7short" },
            { "min": 8192, "max": 32726, "label": "incomegroups/level8", "label_short": "incomegroups/level8short" },
            { "min": 32726, "max": 131072, "label": "incomegroups/level9", "label_short": "incomegroups/level9short" },
            { "min": 131072, "max": 524288, "label": "incomegroups/level10", "label_short": "incomegroups/level10short" },
            { "min": 524288, "max": 2097152, "label": "incomegroups/level11", "label_short": "incomegroups/level11short" },
            { "min": 2097152, "max": 8388608, "label": "incomegroups/level12", "label_short": "incomegroups/level12short" },
            { "min": 8388608, "max": 33554432, "label": "incomegroups/level13", "label_short": "incomegroups/level13short" },
          ]
        }
      },
      "dsShow": false,
      "dsHowManyHomes": 10,
      "dsTopic": "families",
      "showBilly": false,
      "billyFaces": true,
      "howManyBilly": 10,
      "billyYScale": 0.5,
      "billyMeshXPoints": 80,
      "inpercent": true,
      "timeInBackground": true,
      "curve": "curveBasis",
      "showForecastOverlay": true,
      "showForecast": false,
      "pauseBeforeForecast": true,
      "endBeforeForecast": "2022",
      "opacityHighlight": 1.0,
      "opacitySelect": 1.0,
      "opacityHighlightDim": 0.1,
      "opacitySelectDim": 0.3,
      "opacityRegular": 0.8,
      "yMaxMethod": 1,
      showProbeX: true,
      probeX: 2.15,
      probeXCustom: 4,
      probeXType: "extreme",
      probeXDetails: {
        belowProc: true,
        belowCount: false,
        aboveProc: false,
        aboveCount: false
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
      doubtDomain: [1800, 1950, 2020],
      doubtRange: [0, 0, 0]
    },
    "time-slider": {
      "show_value": false
    },
    "buttons": {
      "buttons": ["colors", "find", "inpercent", "moreoptions", "presentation", "sidebarcollapse", "fullscreen"],
    },
    "dialogs": {
      "dialogs": {
        "popup": ["presets", "colors", "find", "billy", "dollarstreet", "moreoptions"],
        "sidebar": ["presets", "colors", "find", "dollarstreet"],
        "moreoptions": ["opacity", "speed", "colors", "stack", "billy", "dollarstreet", "povertyline", "technical", "presentation", "about"]
      },
      "find": {
        "enableSelectShowSwitch": false,
        "panelMode": "find",
        "showTabs": {
          "geo": "open"
        }
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

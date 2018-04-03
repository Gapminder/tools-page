VIZABI_MODEL = {
  "state": {
    "time": {
      "startOrigin": "2000",
      "endOrigin": "2014",
      "value": "2000",
      "step": 1,
      "delayThresholdX2": 0,
      "delayThresholdX4": 0,
      "immediatePlay": true,
      "delay": 1000,
      "dim": "year"
    },
    "entities": {
      "dim": "basomrade",
      "show": {}
    },
    "entities_geodomain": {
      "dim": "basomrade",
      "show": {
        "basomrade": {
        }
      },
      "skipFilter": true
    },
    "entities_colorlegend": {
      "dim": "geo"
    },
    "entities_side": {
      "dim": "gender",
      "show": {
        "gender": {
          "$in": ["female", "male"]
        }
      },
      "skipFilter": true
    },
    "marker_order": {
      "limit": 5000,
      "space": ["entities", "time"],
      "hook_order": {
        "use": "indicator",
        "which": "post_secondary_education_min_3_years_aged_25_64"
      }
    },
    "marker": {
      "limit": 5000,
      "space": ["entities", "time", "entities_side", "entities_geodomain"],
      "label_stack": {
        "use": "property",
        "spaceRef": "entities",
        "which": "name"
      },
      "label_side": {
        "use": "property",
        "spaceRef": "entities_side",
        "which": "name"
      },
      "axis_y": {
        "scaleType": "ordinal",
        "use": "property",
        "which": "basomrade",
        "spaceRef": "entities",
        "_important": false
      },
      "axis_x": {
        "use": "indicator",
        "which": "mean_income_aged_gt_20",
        "allow": {
          "scales": ["linear"],
          "namesOnlyThese": true,
          "names": ["mean_income_aged_gt_20","median_income_aged_gt_20"]
        }
      },
      "color": {
        "use": "indicator",
        "which": "post_secondary_education_min_3_years_aged_25_64",
        "allow": {
          "namesOnlyThese": true,
          "names": ["post_secondary_education_min_3_years_aged_25_64"]
        },
        "spaceRef": "entities",
        "palette": {
        "0": "hsl(270, 80%, 55%)",
        "12": "hsl(202, 80%, 55%)",
        "25": "hsl(135, 80%, 55%)",
        "37": "hsl(48, 80%, 55%)",
        "50": "hsl(355, 80%, 65%)",
        "75": "hsl(302, 70%, 65%)",
        "100": "hsl(302, 70%, 91%)",
        "_default": "#ffb600"
        },
        "syncModels": ["marker_colorlegend"]
      },
      "side": {
        "use": "property",
        "which": "gender",
        "spaceRef": "entities_side",
        "allow": {
          "scales": ["ordinal"]
        }
      }
    },
    "entities_allpossible": {
      "dim": "basomrade"
    },
    "marker_allpossible": {
      "limit": 5000,
      "space": ["entities_allpossible"],
      "label": {
        "use": "property",
        "which": "name"
      }
    },
    "entities_allpossibleside": {
      "dim": "gender"
    },
    "marker_allpossibleside": {
      "space": ["entities_allpossibleside"],
      "label": {
        "use": "property",
        "which": "name"
      }
    },
    "marker_colorlegend": {
      "space": ["entities_colorlegend"],
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
    },
    "entities_tags": {
      "dim": "tag"
    },
    "marker_tags": {
      "space": ["entities_tags"],
      "label": {
        "use": "property",
        "which": "name"
      },
      "hook_parent": {
        "use": "property",
        "which": "parent"
      }
    }
  },
  "ui": {
    "buttons": ["colors", "find", "moreoptions", "fullscreen"],
    "dialogs": {
      "popup": ["timedisplay", "colors", "find", "moreoptions"],
      "sidebar": ["timedisplay", "colors", "find"],
      "moreoptions": ["opacity", "speed", "colors", "presentation", "about"]
    },
    "splash": true
  }
}

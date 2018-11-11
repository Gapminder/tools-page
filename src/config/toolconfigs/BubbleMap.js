var VIZABI_MODEL = {
  "state": {
    "time": {
      "dim": "time"
    },
    "entities": {
      "dim": "country",
      "show": {}
    },
    "entities_colorlegend": {
      "dim": "gavi_region"
    },
    "marker": {
      "space": ["entities", "time"],
      "label": {
        "use": "property",
        "which": "name"
      },
      "hook_lat": {
        "use": "property",
        "which": "latitude",
        "_important": true
      },
      "hook_lng": {
        "use": "property",
        "which": "longitude",
        "_important": true
      },
      "color": {
        "use": "property",
        "which": "gavi_region"
      },
      "size": {
        "use": "indicator",
        "which": "bcg_fvp"
      }
    }
  },
  "ui": {
    "treemenu": {
      "folderStrategyByDataset": {
        "data": "spread",
        "data_wdi": "folder:other_datasets"
      }
    },
    "datawarning": {
      "doubtDomain": [1800, 1950, 2015],
      "doubtRange": [1.0, 0.3, 0.2]
    },
    "map": {
      "scale": 1,
      "preserveAspectRatio": false,
      "offset": {
        "top": 0.05,
        "bottom": -0.12
      }
    },
    "splash": true
  }
};
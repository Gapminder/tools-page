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
      "axis_x": {
        "use": "indicator",
        "which": "co_financing_payments"
      },
      "axis_y": {
        "use": "property",
        "which": "name"
      },
      "color": {
        "use": "property",
        "which": "gavi_region"
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
      "doubtRange": [1.0, 0.8, 0.6]
    },
    "dialogs": {
      "dialog": {
        "find": { 
          enableSelectShowSwitch: true,
          "enablePicker": true
        }
      }
    },
    "splash": true
  }
}
;
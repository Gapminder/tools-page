var VIZABI_MODEL = {
  "state": {
    "time": {
      "dim": "time"
    },
    "entities": {
      "dim": "country",
      "show": {
        "country": { "$in": ["usa", "rus", "chn", "nga"] }
      }
    },
    "marker": {
      "space": ["entities", "time"],
      "label": {
        "use": "property",
        "which": "name"
      },
      "axis_x": {
        "use": "indicator",
        "which": "time",
        "scaleType": "time"
      }
    }
  },
  "ui": {
    "treemenu": {
      "folderStrategyByDataset": {
        "data": "spread"
      }
    },
    "datawarning": {
      "doubtDomain": [1800, 1950, 2015],
      "doubtRange": [1.0, 0.3, 0.2]
    },
    "dialogs": {
      "dialog": {
        "find": { 
          enableSelectShowSwitch: true,
          enablePicker: true
        }
      }
    }
  }
}
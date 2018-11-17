var VIZABI_MODEL = {
  "state": {
    "time": {
      "dim": "time",
      "delay": 1000,
      "value": "2000"
    },
    "entities": {
      "dim": "wb_long_2017",
      "show": {}
    },
    "marker": {
      "space": ["entities", "time"],
      "label": {
        "use": "property",
        "which": "name"
      },
      "axis_y": {
        "use": "indicator",
        "which": "dtp3_coverage"
      },
      "color": {
        "use": "indicator",
        "which": "dtp3_coverage"
      },
      "axis_x": {
        "use": "indicator",
        "which": "time",
        "scaleType": "time"
      },
      opacitySelectDim: 0.1
    }
  },
  "ui": {
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
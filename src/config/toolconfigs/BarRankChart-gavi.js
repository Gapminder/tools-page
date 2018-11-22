var VIZABI_MODEL = {
  "state": {
    "time": {
      "dim": "time",
      "delay": 1000,
      value: "2017"
    },
    "entities": {
      "dim": "country",
      "show": {}
    },
    "entities_colorlegend": {
      "dim": "gavi"
    },
    "marker": {
      "space": ["entities", "time"],
      "label": {
        "use": "property",
        "which": "name"
      },
      "axis_x": {
        "use": "indicator",
        "which": "underimmunized"
      },
      "axis_y": {
        "use": "property",
        "which": "name"
      },
      "color": {
        "use": "indicator",
        "which": "eligibility",
        "spaceRef": null
      },
      opacitySelectDim: 0.1
    }
  },
  "ui": {
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
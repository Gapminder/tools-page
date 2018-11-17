var VIZABI_MODEL = {
  "state": {
    "time": {
      "dim": "time",
      "delay": 1000,
      value: "2017"
    },
    "entities": {
      "dim": "country",
      "show": { "gavi": { "$in": ["gavi"] }}
    },
    "entities_colorlegend": {
      "dim": null
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
        "use": "indicator",
        "which": "u5mr"
      },
      "size": {
        "use": "indicator",
        "which": "u5_deaths"
      },
      opacitySelectDim: 0.1
    }
  },
  "ui": {
    "dialogs": {
      "dialog": {
        "find": { 
          enableSelectShowSwitch: true,
        }
      }
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
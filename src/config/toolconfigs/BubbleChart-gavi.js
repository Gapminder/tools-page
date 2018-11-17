var VIZABI_MODEL = {
  state: {
    time: {
      "dim": "time",
      "delay": 1000,
      value: "2000"
    },
    entities: {
      "dim": "country"
    },
    "entities_colorlegend": {
      "dim": "gavi"
    },
    marker: {
      color: {
        use: "property",
        which: "gavi"
      },
      axis_x: {
        which: "bop"
      },
      axis_y: {
        which: "penta_coverage"
      },
      label: {
        which: "name"
      },
      size: {
        which: "surviving_infants",
        use: "indicator"
      },
      opacitySelectDim: 0.1
    }
  },
  ui: { 
    dialogs: { 
      dialog: { 
        find: {
          enableSelectShowSwitch: true,
          enablePicker: true
        }
      }
    }
  }
};


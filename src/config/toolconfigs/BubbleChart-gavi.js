var VIZABI_MODEL = {
  state: {
    "entities_colorlegend": {
      "dim": "gavi_region"
    },
    marker: {
      color: {
      	use: "property",
      	which: "gavi_region"
      },
      axis_x: {
      	which: "bcg_coverage"
      },
      axis_y: {
      	which: "dtp1_coverage"
      }
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


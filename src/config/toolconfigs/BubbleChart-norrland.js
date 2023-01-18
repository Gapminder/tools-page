var VIZABI_MODEL = {
  "state": {
    "time": {
      "dim": "YEAR"
    },
    "entities": {
      "dim": "HASC_2"
    },
    "entities_colorlegend": {
      "dim": "HASC_2"
    },
    "entities_tags": {
      "dim": null
    },
    "marker": {
      "axis_x": {
        which: "GHQ-12 T"
      },
      "axis_y": {
        which: "Self-rated health T"
      },
      "label": {
        which: "NAME_2"
      },
      "color": {
        use: "property",
        which: "NAME_1",
        scaleType: "ordinal"
      },
      "size": {
        use: "indicator",
        which: "Population",
        scaleType: "linear"
      }
    }
  
  }
};

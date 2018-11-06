var VIZABI_MODEL = {
  state: {
    marker: {
      axis_x: {
        use: "indicator",
        which: "Household income per capita ($PPP 2011)",
        scaleType: "log"
      },
      color: {
        which: "GAVI Status",
        use: "indicator",
        scaleType: "ordinal"
      }
    }
  },
  ui: {
    "datawarning": {
      "doubtDomain": [1800, 2020],
      "doubtRange": [0, 0]
    }
  }
};


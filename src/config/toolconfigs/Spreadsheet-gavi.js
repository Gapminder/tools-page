var VIZABI_MODEL = { 
  "state": {
    "entities": {
      "dim": "country",
      "show": {}
    },
    "time": {
      "dim": "time"
    },
    "marker": {
      "space": ["entities", "time"],
      "label": {
        "use": "property",
        "which": "name"
      },
      "hook": {
        "use": "indicator",
        "which": null
      }
    }
  },
  "ui": {
    "treemenu": {
      "folderStrategyByDataset": {
        "data": "spread",
      }
    }
  }
};
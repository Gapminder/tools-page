export const VIZABI_MODEL = {
  "model": {
    "markers": {
      "spreadsheet": {
        "data": {
          "space": ["geo", "time"],
          "filter": { "dimensions": { "geo": { "$or": [{ "un_state": true }] } } }
        },
        "encoding": {
          "show": {
            "data": {
              "filter": { "dimensions": { "geo": { "$not": { "is--country": 1, "un_state": 0 } } } }
            }
          },
          "number": {
            "data": { "concept": "lex" }
          },
          "label": {
            "data": { "concept": "name" }
          }
        }
      }
    }
  },
  ui: {
    "locale": { "id": "en", "shortNumberFormat": true },
    "layout": { "projector": false },
    "dialogs": {
      "markercontrols": {
        "disableSlice": false,
        "disableAddRemoveGroups": false
      }
    },
    "chart": {
      "sendTools": [
        {
          "icon": "🏀",
          "tool": "bubbles",
          "label": "Bubbles (as Y axis)",
          "marker": "bubble",
          "encoding": "y",
          "selected": "trail"
        }
      ]
    },
    "tree-menu": {
      "folderStrategyByDataset": {
        "sg": "spread",
        "fasttrack": "spread",
        "wdi": "folder:other_datasets"
      }
    }
  }
};


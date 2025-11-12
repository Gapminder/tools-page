export const VIZABI_MODEL = {
  model: {
    markers: {
      "spreadsheet": {
        data: {
          source: "sg",
          space: ["geo", "time"],
          filter: {
            dimensions: { "geo": { "$or": [{ "un_state": true }] } }
          }
        },
        encoding: {
          "show": {
            modelType: "selection",
            data: {
              filter: { dimensions: { "geo": { "$not": { "is--country": 1, "un_state": 0 } } } }
            }
          },
          "selected": {
            modelType: "selection"
          },
          "highlighted": {
            modelType: "selection"
          },
          "superhighlighted": {
            modelType: "selection"
          },
          number: {
            data: {
              concept: "lex"
            }
          },
          label: {
            data: {
              modelType: "entityPropertyDataConfig",
              concept: "name"
            }
          },
          "color": {
            data: {
              constant: "_default"
            },
            scale: {
              modelType: "color",
              type: "ordinal"
            }
          },
        }
      }
    }
  },
  ui: {
    "buttons": {
      "buttons": []
    },
    "dialogs": {
      "dialogs": {
        "popup": [],
        "sidebar": [],
        "moreoptions": []
      },
      "markercontrols": {
        "disableSlice": true,
        "disableAddRemoveGroups": false,
        "primaryDim": "geo",
        "drilldown": "country",
        "shortcutForSwitch": false
      },
    },
    chart: {
      opacitySelectDim: 0.3,
    },
    "tree-menu": {
      "showDataSources": false,
      "folderStrategyByDataset": {
        "sg": "spread",
        "fasttrack": "spread",
        "wdi": "folder:other_datasets"
      }
    }
  }
};


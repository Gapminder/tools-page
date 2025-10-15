export const VIZABI_MODEL = {
  model: {
    markers: {
      "spreadsheet": {
        data: {
          source: "boendebarom",
          space: ["geo", "year"],
          filter: {
            dimensions: { "geo": { "$or": [{ "is--kommun": true }] } }
          }
        },
        encoding: {
          "show": {
            modelType: "selection",
            data: {
              filter: { dimensions: { "geo": { "$not": { "is--deso": 1 } } } }
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
            data: {}
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
    "dialogs": {
      "markercontrols": {
        "disableSlice": true,
        "disableAddRemoveGroups": false,
        "primaryDim": "geo",
        "drilldown": "region.kommun.regso",
        "shortcutForSwitch": true,
        "shortcutForSwitch_allow": ["kommun", "regso"],
      },
    },
    "marker-contextmenu": {
      "primaryDim": "geo",
      "drilldown": "region.kommun.regso"
    },
    chart: {
      opacitySelectDim: 0.3,
    },
    "tree-menu": {
      "showDataSources": false,
      "folderStrategyByDataset": {
        "kolada": "spread",
        "boendebarom": "spread",
        "wdi": "folder:other_datasets"
      }
    }
  }
};



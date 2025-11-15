export const VIZABI_MODEL = {
  model: {
    markers: {
      "spreadsheet": {
        // data: {
        //   source: "boba",
        //   space: ["geo", "year"],
        //   filter: {
        //     dimensions: { "geo": { "$or": [{ "is--kommun": true }] } }
        //   }
        // },
        encoding: {
          "show": {
            modelType: "selection",
            // data: {
            //   filter: { dimensions: { "geo": { "$not": { "is--deso": 1 } } } }
            // }
          },
          label: {
            data: {
              concept: "name"
            }
          }
        }
      }
    }
  },
  ui: {
    "dialogs": {
      "markercontrols": {
        //"disableSlice": true,
        //"disableAddRemoveGroups": false,
        //"primaryDim": "geo",
        //"drilldown": "region.kommun.regso",
        "shortcutForSwitch": false,
        //"shortcutForSwitch_allow": ["kommun", "regso"],
      },
    },
    "marker-contextmenu": {
      // "primaryDim": "geo",
      // "drilldown": "region.kommun.regso"
    },
    "tree-menu": {
      "folderStrategyByDataset": {
        // "kolada": "spread",
        // "boba": "spread",
        // "wdi": "folder:other_datasets"
      }
    }
  }
};


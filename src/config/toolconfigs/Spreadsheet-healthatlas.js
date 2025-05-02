export const VIZABI_MODEL = {
  model: {
    markers: {
      "spreadsheet": {
        data: {
          source: "healthatlas"
        }
      }
    }
  },
  ui: {
    chart: {},
    "tree-menu": {
      "showDataSources": false,
      "folderStrategyByDataset": {
        "kolada": "spread",
        "healthatlas": "spread",
        "wdi": "folder:other_datasets"
      }
    }
  }
};



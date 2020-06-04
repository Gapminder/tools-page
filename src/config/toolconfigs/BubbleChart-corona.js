

VIZABI_MODEL = { 
  "state": {
    "time": {
      "dim": "time",
      "showForecast": false,
      "unit": "day",
      "format": {"ui": "%d %b"}
    },
    "entities": {
      "dim": "geo"
    },
    "entities_colorlegend": {
      "dim": "world_4region"
    },
    
    "marker": {
      "space": ["entities", "time"],
      "label": {
        "use": "property",
        "which": "name"
      },
      "color": {
        "use": "property",
        "which": "world_4region",
        "scaleType": "ordinal",
        "syncModels": ["marker_colorlegend"]
      },
      "axis_y": {
        "use": "indicator",
        "data": "data_covid_spread",
        "which": "cases",
        "scaleType": "linear"
      },
      "axis_x": {
        "use": "indicator",
        "data": "data_covid_spread",
        "which": "deaths",
        "scaleType": "linear"
      },
      "size": {
        "use": "constant",
        "data": "data",
        "which": "_default",
        "scaleType": "ordinal",
        "allow": {
          "scales": ["linear"],
          "names": ["_default"]
        }
      },
    },
    "marker_colorlegend":{
      "space": ["entities_colorlegend"],
      "opacityRegular": 0.8,
      "opacityHighlightDim": 0.3,
      "label": {
        "use": "property",
        "which": "name"
      },
      "hook_rank": {
        "use": "property",
        "which": "rank"
      },
      "hook_geoshape": {
        "use": "property",
        "which": "shape_lores_svg"
      }
    }
  },
  "ui": {
    "treemenu": {
      "folderStrategyByDataset": {
        "data": "folder:other_datasets",
        "data_covid_spread": "spread",
        "data_covid_csv": "spread",
        "data_covid_response": "root",
        "data_fasttrack": "folder:other_datasets",
        "data_wdi": "folder:other_datasets"
      }
    },
    "datawarning": {
      "doubtDomain": [1800, 2050],
      "doubtRange": [0, 0]
    },
    "splash": false
  }
}



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
        "syncModels": ["marker_colorlegend"],
        "allow": {
          "names": ["!time"]
        }   
      },
      "axis_y": {
        "use": "indicator",
        "data": "data_covid_spread",
        "which": "cases",
        "scaleType": "linear",
        "allow": {
          "names": ["!time"]
        }        
      },
      "axis_x": {
        "use": "indicator",
        "data": "data_covid_spread",
        "which": "deaths",
        "scaleType": "linear",
        "allow": {
          "names": ["!time"]
        }
      },
      "size": {
        "use": "constant",
        "data": "data",
        "which": "_default",
        "scaleType": "ordinal",
        "allow": {
          "scales": ["linear"],
          "names": ["_default", "!time"]
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
        "data": "spread",
        "data_covid_spread": "spread",
        "data_covid_response": "root",
        "data_covid_csv": "spread"
      }
    },
    "datawarning": {
      "doubtDomain": [1800, 2050],
      "doubtRange": [0, 0]
    },
    "splash": false
  }
}

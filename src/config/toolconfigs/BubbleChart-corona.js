

VIZABI_MODEL = { 
  "state": {
    "time": {
      "dim": "time",
      "showForecast": false,
      "unit": "day",
      "format": {"ui": "%d %b"}
    },
    "entities": {
      "dim": "country",
      "filter": {
        "country": {"un_state": true}
      }
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
        "use": "indicator",
        "data": "data_covid_spread",
        "which": "week_growth_rate",
        "scaleType": "linear",
        "syncModels": ["marker_colorlegend"],
        "allow": {
          "names": ["!time"]
        }   
      },
      "axis_y": {
        "use": "indicator",
        "data": "data_covid_spread",
        "which": "last_seven_days_deaths",
        "scaleType": "linear",
        "allow": {
          "names": ["!time"]
        }        
      },
      "axis_x": {
        "use": "indicator",
        "data": "data",
        "which": "population_aged_65plus_years_both_sexes_percent",
        "scaleType": "linear",
        "allow": {
          "names": ["!time"]
        }
      },
      "size": {
        "use": "indicator",
        "data": "data",
        "which": "population_total",
        "scaleType": "linear",
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
    "show_ticks": false,
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

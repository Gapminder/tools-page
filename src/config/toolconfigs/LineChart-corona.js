VIZABI_MODEL = { 
  "state": {
    "time": {
      "dim": "time",
      "showForecast": false,
      "unit": "day",
      "format": {"ui": "%b %d"}
    },
    "entities": {
      "dim": "country",
      "filter": {
        "country": {"un_state": true}
      },
      "show": {
        "country": { "$in": ["swe", "fin", "dnk", "nor"] }
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
      "axis_y": {
        "use": "indicator",
        //"which": "income_per_person_gdppercapita_ppp_inflation_adjusted",
        "data": "data_covid_spread",
        "which": "last_seven_days_deaths",
        //"scaleType": "linear"
      },
      "axis_x": {
        "data": "data_covid_spread",
        "use": "indicator",
        "which": "time",
        "scaleType": "time"
      },
      "color": {
        "use": "property",
        "which": "country",
        "scaleType": "ordinal",
        "allow": {
          "scales": ["ordinal"]
        },
        "syncModels": ["marker_colorlegend"]
      }
    },
    "marker_colorlegend": {
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
    "dialogs": {
      "dialog": {
        "find": {"showTabs": {"country": "open"}}
      }
    }
  }
}

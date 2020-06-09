

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
        "use": "indicator",
        "data": "data_covid_spread",
        "which": "week_growth_rate",
        "scaleType": "linear",
        "paletteHiddenKeys": [],
        "domainMin": 0,
        "domainMax": 5,
        "clamp": true,
        "palette": { 
          "0": "#80ffd3",
          "8": "#6DC55B",
          "14": "#74CF4A",
          "18": "#92D955",
          "19": "#EEAC3C",
          "22": "#EEAC3C",
          "25": "#ee9c3c",          
          "30": "#E47449",
          "50": "#f47843",  
          "60": "#E4622B",
          "75": "#db501d",
          "90": "#CB493B",          
          "100": "#BD2A23",
        },
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

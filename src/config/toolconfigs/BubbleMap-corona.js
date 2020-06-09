VIZABI_MODEL = { 
  "state": {
    "time": {
      "dim": "time",
      "showForecast": false,
      "unit": "day",
      "format": {"ui": "%Y %b %d"}
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
      "size": {
        "use": "indicator",
        "data": "data_covid_spread",
        "which": "last_seven_days_deaths",
        "scaleType": "linear",
        "allow": {
          "scales": ["linear"],
          "names": ["_default"]
        }
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
        "syncModels": ["marker_colorlegend"]
      },
      "hook_lat": {
        "use": "property",
        "which": "latitude",
        "_important": true
      },
      "hook_lng": {
        "use": "property",
        "which": "longitude",
        "_important": true
      }
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
    "map": {
      "scale": 1,
      "preserveAspectRatio": false,
      "offset": {
        "top": 0.05,
        "bottom": -0.12
      }
    },
    "splash": false
  }
}

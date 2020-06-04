

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
      "size": {
        "use": "indicator",
        "data": "data_covid_csv",
        "which": "Deaths reported during last 7 days",
        "scaleType": "linear",
        "allow": {
          "scales": ["linear"],
          "names": ["_default"]
        }
      },
      "color": {
        "use": "indicator",
        "data": "data_covid_csv",
        "which": "Change of number of deaths reported  compared to previouse 7 days",
        "scaleType": "linear",
        "paletteHiddenKeys": [],
        "palette": { 
          "-2": "#61B15A",
          "0": "#61B15A",
          "0.40": "#6DC55B",
          "0.70": "#74CF4A",
          "0.90": "#92D955",
          "0.95": "#EEAC3C",
          "1.10": "#EEAC3C",
          "1.50": "#E47449",
          "3.00": "#E4622B",
          "4.50": "#CB493B",
          "25": "#BD2A23",
          "50": "#BD2A23",
          "75": "#BD2A23",
          "100": "#BD2A23"
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

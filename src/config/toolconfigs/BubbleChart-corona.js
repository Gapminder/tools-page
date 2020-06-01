

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
//    "entities_colorlegend": {
//      "dim": "world_4region"
//    },
    
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
        //"syncModels": ["marker_colorlegend"]
      }    
//      "axis_y": {
//        "use": "indicator",
//        "which": "life_expectancy_years",
//        "zoomedMin": 19,
//        "zoomedMax": 86,
//        "domainMin": 0,
//        "domainMax": 100
//      },
//      "axis_x": {
//        "use": "indicator",
//        "scaleType": "log",
//        "domainMax": 180000,
//        "domainMin": 300,
//        "zoomedMax": 96000,
//        "zoomedMin": 400,
//        "which": "income_per_person_gdppercapita_ppp_inflation_adjusted"
//      },
//      "size": {
//        "use": "indicator",
//        "which": "population_total",
//        "domainMin": 15,
//        "domainMax": 1400000000,
//        "scaleType": "linear",
//        "allow": {
//          "scales": ["linear"],
//          "names": ["_default"]
//        }
//      },
    },
//    "marker_colorlegend":{
//      "space": ["entities_colorlegend"],
//      "opacityRegular": 0.8,
//      "opacityHighlightDim": 0.3,
//      "label": {
//        "use": "property",
//        "which": "name"
//      },
//      "hook_rank": {
//        "use": "property",
//        "which": "rank"
//      },
//      "hook_geoshape": {
//        "use": "property",
//        "which": "shape_lores_svg"
//      }
//    }
  },
  "ui": {
    "treemenu": {
      "folderStrategyByDataset": {
        "data": "spread",
        "data_covid_response": "root",
        "data_fasttrack": "spread",
        "data_wdi": "folder:other_datasets"
      }
    },
    "datawarning": {
      "doubtDomain": [1800, 2050],
      "doubtRange": [0, 0]
    },
    "splash": true
  }
}

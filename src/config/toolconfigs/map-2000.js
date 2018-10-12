VIZABI_MODEL = {
  "state": {
    "time": {
      "startOrigin": "1993",
      "endOrigin": "2015",
      "value": "2000",
      "dim": "year",
      "delay": 700
    },
    "entities": {
      "dim": "basomrade"
    },
    "entities_colorlegend": {
      "dim": "basomrade"
    },
    "entities_map_colorlegend": {
      "dim": "basomrade"
    },
    "marker": {
      "space": ["entities", "time"],
      "label": {
        "use": "property",
        "which": "name"
      },
      "hook_centroid": {
        "use": "property",
        "which": "basomrade",
        "_important": true
      },
      "size": {
        "which": "Befolkning Total",
        "use": "indicator",
        "scaleType": "linear",
        "extent": [0, 0.4],
        "allow": {
          "scales": ["linear"]
        }
      },
      "color": {
        "use": "indicator",
        "which": "Befolkning Total",
        "scaleType": "linear",
        "syncModels": ["marker_colorlegend"]
      },
      "color_map": {
        "use": "property",
        "which": "basomrade",
        "scaleType": "ordinal",
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
    datawarning: {
      doubtDomain: [2000, 2014],
      doubtRange: [0, 0]
    },
    "map": {
      "scale": 1,
      "preserveAspectRatio": true,
      "mapEngine": "mapbox",
      "mapStyle": "mapbox://styles/mapbox/light-v9",
      "showBubbles": false,
      "showAreas": true,
      "showMap": false,
      "offset": {
        "top": 0.05,
        "bottom": -0.12,
        "left": 0,
        "right": 0
      },
      "path": null,
      "bounds": {
        "north": 59.48,
        "west": 17.72,
        "south": 59.21,
        "east": 18.32
      },
      "projection": "mercator",
      "topology": {
        "path": "data/basomr2010_110617_wgs84.json",
        "objects": {
          "geo": "basomr2010_110617",
          "boundaries": "basomr2010_110617"
        },
        "geoIdProperty": "BASKOD2000"
      }
    },
    "splash": true
  }
};

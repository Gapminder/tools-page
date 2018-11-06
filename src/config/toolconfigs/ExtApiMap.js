var VIZABI_MODEL = {
  "state": {
    "marker": {
      "space": ["entities", "time"],
      "label": {
        "use": "property",
        "which": "NAME_2"
      },
      size: {
        "autoconfig": {
          index: 2,
          type: "measure"
        }
      },      
      "hook_centroid": {
        "use": "property",
        "which": "ID_2",
        "_important": true
      },
      "color": {
        "use": "indicator",
        "scaleType": "linear",
        "syncModels": ["marker_colorlegend"]
      },
      "color_map": {
        "use": "property",
        "which": "NAME_1",
        "scaleType": "ordinal",
        "syncModels": ["marker_colorlegend"]
      }
    },
    "marker_allpossible": {
      "space": ["entities"],
      "label": {
          "use": "property",
          "which": "NAME_2"
      },
      "skipFilter": true
    },
    "marker_colorlegend": {
      "space": ["entities_colorlegend"],
      "opacityRegular": 0.8,
      "opacityHighlightDim": 0.3,
      "label": {
        "use": "property",
        "which": "NAME_2"
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
    zoomOnScrolling: false,
    datawarning: {
      doubtDomain: [2000, 2014],
      doubtRange: [0, 0]
    },
    "map": {
      "scale": 1,
      "preserveAspectRatio": true,
      "mapEngine": "mapbox",
      "mapStyle": "mapbox://styles/mapbox/light-v9",
      "showBubbles": true,
      "showAreas": true,
      "showMap": true,
      "offset": {
        "top": 0.05,
        "bottom": -0.12,
        "left": 0,
        "right": 0
      },
      "path": null,
      "bounds": {
        "north":69.51657759386163,
        "west":10.654920454289538,
        "south":61.75276362335023,
        "east":23.864444812776867
      },
      "projection": "mercator",
      "topology": {
        "path": "data/SWE_adm2.json",
        "objects": {
          "geo": "SWE_adm2-1",
          "boundaries": "SWE_adm2-1"
        },
        "geoIdProperty": "ID_2"
      }
    },
    "splash": true
  }
};
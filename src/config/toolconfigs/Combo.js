var VIZABI_MODEL = {
  "state": {
    "marker": {
      "space": ["entities", "time"],
      "label": {
        "use": "property",
        "which": "NAME_2"
      },
      "color": {
        "use": "property",
        "which": "NAME_1",
        "scaleType": "ordinal",
        "syncModels": ["marker_colorlegend"]
      },
      "hook_centroid": {
        "use": "property",
        "which": "ID_2",
        "_important": true
      },
      "color_map": {
        "use": "property",
        "which": "NAME_1",
        "scaleType": "ordinal",
        "syncModels": ["marker_colorlegend"]
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
      "overflowBottom": 50,
      "scale": 1,
      "preserveAspectRatio": true,
      "mapEngine": "mapbox",
      "mapStyle": "mapbox://styles/mapbox/light-v9",
      "showBubbles": true,
      "showAreas": false,
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
    }
  
  }
};

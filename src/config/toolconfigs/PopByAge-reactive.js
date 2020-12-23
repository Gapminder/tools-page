VIZABI_MODEL = {
  model: {
    markers: {
      "popbyage": {
        data: {
          source: "pop",
          space: ['geo','year','age', 'gender'],
          filter: {
            dimensions: { 
              "geo": { 
                "geo": {
                  "$in": ["usa", "swe", "nga"]
                }
              }
            }
          }
        },
        requiredEncodings: ["x"],
        encoding: {
          "selected": {
            modelType: "selection"
          },
          "highlighted": {
            modelType: "selection"
          },
          x: { data: { concept: 'population' } },
          y: { 
            data: { concept: 'age' },
            scale: { type: "linear" }
          },
          label: { 

            data: { 
     
              modelType: 'entityPropertyDataConfig',
              concept: 'name' 
            }
          },
          frame: {
            modelType: 'frame', 
            data: { concept: 'year' } 
          },
          color: {
            data: {
              space: ["geo"],
              concept: "world_4region"
            },
            scale: {
              modelType: "color",
              type: "ordinal"
            }
          },
          side: { data: { concept: 'gender' } },
          facet: { 
            modelType: 'grouping', 
            data: { concept: 'geo' } 
          }
        }
      },
      "legend": {
          data: {
            ref: {
              transform: "entityConceptSkipFilter",
              model: "markers.popbyage.encoding.color"
            }
          },
          encoding: {
            color: {
              data: {
                concept: { ref: "markers.popbyage.encoding.color.data.concept" },
                constant: { ref: "markers.popbyage.encoding.color.data.constant" }
              },
              scale: {
                modelType: "color",
                palette: { ref: "markers.popbyage.encoding.color.scale.palette" }
              }
              //scale: { ref: "markers.bubble.encoding.color.scale" }
            },
            name: { data: { concept: "name" } },
            rank: { data: { concept: "rank" } },
            map: { data: { concept: "shape_lores_svg" } }
          }
        },
      }
    },
  ui: {
    //ui
    chart: {
      //mode: "smallMultiples",
      stacked: true,
      inpercent: false,
      flipSides: true,
      lockActive: true,
      lockNonSelected: 0
    },
    "buttons": {
      "buttons": ["colors", "find", "lock", /*"side",*/ "inpercent", "moreoptions", "sidebarcollapse", "fullscreen"]
    },
    "dialogs": {
      "dialogs": {
        "popup": ["timedisplay", "colors", "find", /*"side",*/ "moreoptions"],
        "sidebar": ["timedisplay", "colors", "find"/*, "grouping"*/],
        "moreoptions": ["opacity", "speed", /*"grouping",*/ "colors", /*"side",*/ "presentation", "about"],
      },
      "find": {
        "panelMode": "show",
        "showTabs": {
          "country": "open"
        },
        enablePicker: false
      }      
    },
    presentation: false
  }
};

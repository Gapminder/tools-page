export default[
{
  "toolIds": ["bubbles", "mountain", "map", "linechart", "barrank"],
  "datasource": {
    "reader": "waffle",
    "path": "https://waffle-server-dev.gapminderdev.org/api/ddf/ql",
    "assetsPath": "https://import-waffle-server-dev.gapminderdev.org/api/ddf/assets/"
  }
},
{
  "toolIds": ["popbyage"],
  "datasource": {
    "reader": "waffle", 
    "dataset": "open-numbers/ddf--gapminder--population#develop", 
    "path": "https://waffle-server-dev.gapminderdev.org/api/ddf/ql",
    "assetsPath": "https://import-waffle-server-dev.gapminderdev.org/api/ddf/assets/"
  }
},
{
  "toolIds": ["bubblechart-sod"],
  "datasource": {
    "reader": "waffle",
    "path": "https://waffle-server-dev.gapminderdev.org/api/ddf/ql",
    "dataset": "open-numbers/ddf--sodertornsmodellen",
    "assetsPath": "https://import-waffle-server-dev.gapminderdev.org/api/ddf/assets/"
  }
},
{
  "toolIds": ["bubblechart1", "bubblechart-basic"],
  "datasource": {
    "reader": "csv",
    "path": "data/basic.csv"
  }
}
]

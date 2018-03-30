export default [
{
  "toolIds": ["bubbles", "mountain", "map", "linechart", "barrank"],
  "datasource": {
    "reader": "waffle", 
    "assetsPath": "https://import-waffle-server-dev.gapminderdev.org/api/ddf/assets/",
    "path": "https://waffle-server-dev.gapminderdev.org/api/ddf/ql",
  }
},
{
  "toolIds": ["popbyage"],
  "datasource": {
    "reader": "waffle", 
    "assetsPath": "https://import-waffle-server-dev.gapminderdev.org/api/ddf/assets/",
    "path": "https://waffle-server-dev.gapminderdev.org/api/ddf/ql",
    "dataset": "open-numbers/ddf--gapminder--population"
  }
},
{
  "toolIds": ["bubblechart-sod"],
  "datasource": {
    "reader": "waffle",
    "assetsPath": "https://import-waffle-server-stage.gapminder.org/api/ddf/assets/",
    "path": "https://waffle-server-stage.gapminder.org/api/ddf/ql",
    "dataset": "open-numbers/ddf--sodertornsmodellen"
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
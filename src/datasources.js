export default[
{
  "toolIds": ["bubblechart", "linechart", "barrankchart"],
  "datasource": {
    "reader": "waffle", "path": "https://waffle-server-dev.gapminderdev.org/api/ddf/ql"
  }
},
{
  "toolIds": ["popbyage"],
  "datasource": {
    "reader": "waffle", 
    "dataset": "open-numbers/ddf--gapminder--population#develop", 
    "path": "https://waffle-server-dev.gapminderdev.org/api/ddf/ql"
  }
},
{
  "toolIds": ["bubblechart-sod"],
  "datasource": {
    "reader": "waffle",
    "path": "https://waffle-server-dev.gapminderdev.org/api/ddf/ql",
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

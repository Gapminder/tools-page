import Table from "../../core/table";
import {
  viz,
  setTool
} from "../../core/tool";
import {
  URLI
} from "../../core/url";

const readersSchema = {
  "ddfcsv": ["path"],
  "csv": ["path", "timeInColumns", "hasNameColumn", "nameColumnIndex"],
  "google_csv": ["path", "sheet", "timeInColumns", "hasNameColumn", "nameColumnIndex"],
  "ddfbw": ["service", "name", "version", "translateContributionLink"]
};

const defaultValues = {
  "reader": "ddfbw",
  "nameColumnIndex": 1,
  "service": "https://big-waffle.gapminder.org"
};
const propDependency = {
  "nameColumnIndex": {
    "hasNameColumn": true
  }
};
const propTypes = {
  "reader": {
    "type": "dropdown",
    "options": Object.keys(readersSchema)
  },
  "timeInColumns": {
    "type": "checkbox"
  },
  "hasNameColumn": {
    "type": "checkbox"
  }
};

const DataEditor = function(placeHolder, translator, dispatch, { languages, selectedLanguage, onClick }) {
  let data;

  dispatch.on("menuOpen.dataEditor", d => {
    if (d.menu_label !== "data_editor") return;
    makeData();
    updateTable();
  });

  function makeData() {
    const datasources = viz.model.dataSources;
    data = Object.keys(datasources).map(id => {
      const reader = datasources[id].config.modelType;
      return {
        id,
        reader,
        ...readersSchema[reader].reduce((obj, prop) => {
          obj[prop] = datasources[id].config[prop] || "";
          return obj;
        }, {})
      };
    });
  }

  const table = Table()
    .on("remove", (d, i) => {
      data.splice(i, 1);
      updateTable();
    })
    .on("prop_change", () => {
      updateDataWhenReaderChanges();
      updateTable();
    });

  function updateTable(rowdata = data) {
    placeHolder.select(".table")
      .datum({ rowdata, propTypes })
      .call(table);
    showhideTableRows();
  }

  function updateDataWhenReaderChanges() {
    data = data.map(ds => {
      //delete properties that are not applicable for the selected reader
      Object.keys(ds).forEach(f => {
        if (f !== "id" && f !== "reader" && !readersSchema[ds.reader].includes(f)) delete ds[f];
      });
      //add properties that are missing for the selected reader
      readersSchema[ds.reader].forEach(f => {
        if (!ds[f]) ds[f] = defaultValues[f] || "";
      });
      return ds;
    });
  }

  function showhideTableRows() {
    placeHolder.select(".table")
      .selectAll(".row")
      .each(function(props) {
        const allowedProps = getCurrentAllowProp(props);
        d3.select(this)
          .selectAll(".row-data")
          .style("display", d => allowedProps.includes(d.key) ? null : "none");
      });
  }

  function getCurrentAllowProp(ds) {
    return Object.keys(ds).filter(key =>
      !propDependency[key] ? true :
        Object.keys(propDependency[key]).every(
          depProp => propDependency[key][depProp] === ds[depProp]
        )
    );
  }

  placeHolder.select(".add-row")
    .on("click", () => {
      data.push({
        id: "data" + (data.length + 1),
        reader: defaultValues.reader,
        ...readersSchema[defaultValues.reader].reduce((obj, prop) => {
          obj[prop] = defaultValues[prop] || "";
          return obj;
        }, {})
      });
      updateTable();
    });

  placeHolder.select(".de-reload")
    .on("click", () => {
      makeData();
      updateTable();
    });

  placeHolder.select(".de-reset")
    .on("click", () => {
      URLI.model = {};
      setTool(null, true);
      dispatch.call("menuClose");
    });

  placeHolder.select(".de-apply")
    .on("click", () => {
      const dataModel = data.reduce((result, ds) => {
        const dataObj = {};
        const allowedProps = getCurrentAllowProp(ds).filter(f => f !== "id" && f !== "reader");
        allowedProps.forEach(prop => {
          dataObj[prop] = ds[prop];
        });
        dataObj["modelType"] = ds.reader;
        dataObj["locale"] = viz.ui.locale.id;
        result[ds.id] = dataObj;
        return result;
      }, {});

      URLI.model = { model: { dataSources: dataModel } };
      setTool(null, true);
      dispatch.call("menuClose");
    });
};

export default DataEditor;

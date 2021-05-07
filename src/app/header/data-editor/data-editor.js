import Table from "../../core/table";
import {
  viz,
  setTool
} from "../../core/tool";
import {
  URLI
} from "../../core/url";

const readersSchema = {
  "ddf": {
    props: ["path"]
  },
  "csv": {
    props: ["path", "timeInColumns", "hasNameColumn", "nameColumnIndex"]
  },
  "google_csv": {
    props: ["path", "sheet", "timeInColumns", "hasNameColumn", "nameColumnIndex"]
  },
  "ddfbw": {
    props: ["service", "dataset", "version", "translateContributionLink"]
  }
};

const DataEditor = function(placeHolder, translator, dispatch, { languages, selectedLanguage, onClick }) {
  const propNames = ["reader", "path", "sheet", "dataset", "timeInColumns", "hasNameColumn", "nameColumnIndex", "translateContributionLink", "service", "version"];
  const defaultValues = {
    "reader": "ddfbw",
    "nameColumnIndex": 1
  };
  const propDependency = {
    "nameColumnIndex": {
      "hasNameColumn": true
    }
  };
  const propTypes = {
    "reader": {
      "type": "dropdown",
      "data": Object.keys(readersSchema)
    },
    "timeInColumns": {
      "type": "checkbox"
    },
    "hasNameColumn": {
      "type": "checkbox"
    }
  };

  let data;

  const propIndexInData = ["name"].concat(propNames)
    .reduce((prev, v, i) => {
      prev[v] = i;
      return prev;
    }, {});

  const table = Table()
    .on("edit", d => update(d))
    .on("remove", (d, i) => {
      data.splice(i, 1);
      updateTable([data, ["name"].concat(propNames), propTypes]);
    })
    .on("prop_change", () => {
      filterDataRows();
    });

  function updateTable(_data) {
    placeHolder.select(".table")
      .datum(_data)
      .call(table);
    filterDataRows();
  }

  function filterDataRows() {
    placeHolder.select(".table")
      .selectAll(".row")
      .selectAll(".row-data")
      .each(function(d, i) {
        const el = d3.select(this);
        const allPropNames = ["name"].concat(propNames);
        const selectedReader = d.data[propIndexInData["reader"]];
        const allowProps = getCurrentAllowProp(["name", "reader", ...readersSchema[selectedReader].props], d.data);
        el.style("display", allowProps.includes(allPropNames[i]) ? null : "none");
      });
  }

  function getCurrentAllowProp(props, data) {
    return props.filter(prop =>
      !propDependency[prop] ? true :
        Object.keys(propDependency[prop]).every(
          depProp => propDependency[prop][depProp] === data[propIndexInData[depProp]]
        )
    );
  }

  placeHolder.select(".add-row")
    .on("click", () => {
      const newIndex = data[data.length - 1] ? data[data.length - 1].index + 1 : 0;
      const newData = {
        data: ["data_", ...propNames.map(name => defaultValues[name] || "")],
        index: newIndex
      };
      data.push(newData);
      updateTable([data, ["name"].concat(propNames), propTypes]);
    });

  placeHolder.select(".de-apply")
    .on("click", () => {
      const haveDataName = data.map(d => d.data[0]).filter(d => d === "data")[0];
      if (!haveDataName) data[0].data[0] = "data";
      const dataModel = data.reduce((result, d) => {
        const dataObj = {};
        const selectedReader = d.data[propIndexInData["reader"]];
        const allowProps = getCurrentAllowProp(["reader", ...readersSchema[selectedReader].props], d.data);
        propNames.forEach((name, i) => {
          if (allowProps.includes(name) && d.data[i + 1]) dataObj[name] = d.data[i + 1];
        });
        result[d.data[0]] = dataObj;
        return result;
      }, {});

      URLI.model = dataModel;
      setTool(null, true);
      dispatch.call("menuClose");
    });

  placeHolder.select(".de-reload")
    .on("click", () => {
      createTable();
    });

  placeHolder.select(".de-reset")
    .on("click", () => {
      URLI.model = {};
      setTool(null, true);
      dispatch.call("menuClose");
    });

  function createTable() {
    const model = viz.getModel();
    const dataSourcesIds = Object.keys(model).filter(m => /^data/.test(m));
    data = dataSourcesIds.reduce((result, id, index) => {
      result.push({
        data: [id, ...propNames.map(name => model[id][name] || "")],
        index
      });
      return result;
    }, []);
    updateTable([[], ["name"].concat(propNames), propTypes]);
    updateTable([data, ["name"].concat(propNames), propTypes]);
  }

  dispatch.on("menuOpen.dataEditor", d => {
    if (d.menu_label !== "data_editor") return;

    createTable();
  });

};

export default DataEditor;

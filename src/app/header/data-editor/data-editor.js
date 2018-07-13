import Table from "../../core/table";
import {
  viz,
  setTool
} from "../../core/tool";
import {
  URLI,
  updateURL
} from "../../core/url";

const DataEditor = function (placeHolder, translator, dispatch, { languages, selectedLanguage, onClick }) {
  const columnNames = ['reader', 'path', 'dataset', 'assetsPath'];
  let data;

  const table = Table()
    .on('edit', d => update(d))
    .on("remove", (d, i) => {
      data.splice(i, 1);
      updateTable([data, ["name"].concat(columnNames)]);
    })

  function updateTable(_data) {
    placeHolder.select(".table")
      .datum(_data)
      .call(table);
  }

  placeHolder.select(".add-row")
    .on("click", () => {
      const newIndex = data[data.length - 1] ? data[data.length - 1].index + 1 : 0;
      data.push({
        data: ["", ...columnNames.map(() => "")],
        index: newIndex
      });
      updateTable([data, ["name"].concat(columnNames)]);
    });

  placeHolder.select(".de-apply")
    .on("click", () => {
      const haveDataName = data.map(d => d.data[0]).filter(d => d === "data")[0];
      if (!haveDataName) data[0].data[0] = "data";
      const dataModel = data.reduce((result, d, i) => {
        const dataObj = {};
        columnNames.forEach((name, i) => {
          if (d.data[i + 1]) dataObj[name] = d.data[i + 1];
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
        data: [id, ...columnNames.map(name => model[id][name] || "")],
        index
      });
      return result;
    },[]);
    updateTable([[], ["name"].concat(columnNames)]);  
    updateTable([data, ["name"].concat(columnNames)]);  
  }

  dispatch.on("menuOpen.dataEditor", d => {
    if (d.menu_label !== "data_editor") return;

    createTable();
  })

}

export default DataEditor;
var Table = function module() {
    var dispatch = d3.dispatch("edit", "remove", "dropdown_change");

    function exports(_selection) {
        _selection.each(function (_dataset) {

            //________________________________________________
            // Data
            //________________________________________________
            var data = _dataset[0];
            var columnNames = _dataset[1];
            var columnTypes = _dataset[2];

            //________________________________________________
            // Table
            //________________________________________________
            
            var table = d3.select(this).selectAll("table").data([0])
            table = table.enter().append("table").merge(table);

            var dataRows = table.selectAll("tr.row").data(data, d => d.index);
            dataRows.exit().remove();

            var newDataRows = dataRows.enter()
              .append("tr")
              .attr("class", "row");

            newDataRows.append("th")
              .attr("class", "edit")
              .append("a")
              .text("×");

            var rows = newDataRows.selectAll("tr.row-data").data(d => d.data.map(_d => ({
                value: _d,
                data: d.data
              })), d => d.value)
              .enter().append("tr")
              .attr("class", "row-data")

            rows
              .append("th")
              .attr("class", "header .no-select")
              .text((d, i) => columnNames[i])

            rows
              .each(function(_d, i) {
                const el = d3.select(this);
                if (columnTypes[columnNames[i]]) {
                  if (columnTypes[columnNames[i]].type === "dropdown") {
                    const dropDownEl = el.append("td")
                      .attr("class", "cell dropdown")
                    dropDownEl.append("div")
                      .text(d => d.value)
                      .on("click", () => {
                        const listEl = dropDownEl.select("ul");
                        listEl.style("display", listEl.style("display") === "none" ? null : "none");
                      })
                    dropDownEl.append("ul")
                      .style("display", "none")
                      .selectAll("li").data(columnTypes[columnNames[i]].data)
                        .enter()
                        .append("li")
                        .style("display", (d) => d === _d.value ? "none" : null)
                        .text(d => d)
                        .on("click", (d) => {
                          d3.event.stopPropagation();
                          dropDownEl.select("div")
                            .text(d);
                          _d.data[i] = _d.value = d;
                          dropDownEl.selectAll("li")
                            .style("display", (d) => d === _d.value ? "none" : null);
                          dropDownEl.select("ul")
                            .style("display", "none");
                          dispatch.call("dropdown_change");
                        })
                  }
                } else {
                  el.append("td")
                  .attr("class", "cell")
                  .attr("contenteditable", true)
                  .text(d => d.value)
                  .on("keyup", function(d) {
                    d.data[i] = d.value = d3.select(this).text();
                      // var newData = [];
                      // d3.select(".table").selectAll("tr.row").selectAll("td")
                      //     .each(function(d, i, pI){
                      //         var text = d3.select(this).text();
                      //         if (typeof newData[pI] == "undefined") newData[pI] = [];
                      //         newData[pI].push(text)
                      //     });
                      //dispatch.call("edit", null, newData);
                  })
                  .on("paste", () => {
                    d3.event.preventDefault();
                    d3.event.stopPropagation();

                    const selection = window.getSelection();
                    if (!selection.rangeCount) return false;

                    const paste = (d3.event.clipboardData || window.clipboardData).getData("text").trim();
                    const range = selection.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(document.createTextNode(paste));
                    selection.collapseToEnd();
                    selection.focusNode.normalize();
                  });
                }
              })
                    
              table
                .selectAll(".edit")
                .on("click", (d, i) => {
                  dispatch.call("remove", null, d, i);
                });
        });
    }

    d3.rebind(exports, dispatch, "on");

    return exports;
};

export default Table;
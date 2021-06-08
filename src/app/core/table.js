export default function Table() {
  const dispatch = d3.dispatch("edit", "remove", "prop_change");

  function exports(_selection) {
    _selection.each(function({ rowdata, propTypes }) {

      /*
        example
        rowdata = {id: "sg", reader: "ddfbw", service: "https://bw.gapminder.org", dataset: "sg-master"}
      */

      const view = d3.select(this);
      const table = view.select("table").node() ? view.select("table") : view.append("table");

      let subtables = table.selectAll("tr.row").data(rowdata, d => d.id);
      subtables.exit().remove();
      subtables = subtables.enter()
        .append("tr")
        .attr("class", "row")
        .each(function() {
          d3.select(this)
            .append("th")
            .attr("class", "edit")
            .append("a")
            .text("×");
        })
        .merge(subtables);

      let rows = subtables.selectAll("tr.row-data").data(ds => Object.keys(ds).map(key => ({ ds, key, value: ds[key] })), d => d.key);
      rows.exit().remove();
      rows = rows.enter().append("tr")
        .attr("class", "row-data")
        .each(function(d) {
          d3.select(this)
            .append("th")
            .attr("class", "header .no-select")
            .text(d.key);
        })
        .merge(rows);

      rows.each(function(d) {
        const row = d3.select(this);
        row.select(".cell").remove();

        if (propTypes[d.key]) {

          if (propTypes[d.key].type === "checkbox") {
            row.append("td")
              .attr("class", "cell checkbox")
              .append("div")
              .attr("data-checked", d.value)
              .on("click", function() {
                d.ds[d.key] = d.value = !d.value;
                d3.select(this).attr("data-checked", d.value);
                dispatch.call("prop_change");
              });
          }

          if (propTypes[d.key].type === "dropdown") {
            const dropDownEl = row.append("td")
              .attr("class", "cell dropdown");
            dropDownEl.append("div")
              .text(d.value)
              .on("click", () => {
                const listEl = dropDownEl.select("ul");
                listEl.style("display", listEl.style("display") === "none" ? null : "none");
              });
            dropDownEl.append("ul")
              .style("display", "none")
              .selectAll("li").data(propTypes[d.key].options)
              .enter()
              .append("li")
              .style("display", option => option === d.value ? "none" : null)
              .text(option => option)
              .on("click", option => {
                d3.event.stopPropagation();
                dropDownEl.select("div")
                  .text(option);
                d.ds[d.key] = d.value = option;
                dropDownEl.selectAll("li")
                  .style("display", option => option === d.value ? "none" : null);
                dropDownEl.select("ul")
                  .style("display", "none");
                dispatch.call("prop_change");
              });
          }

        } else {

          row.append("td")
            .attr("class", "cell")
            .attr("contenteditable", true)
            .text(d.value)
            .on("keyup", function() {
              d.ds[d.key] = d.value = d3.select(this).text();
            })
            .on("paste", function() {
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

              d.ds[d.key] = d.value = d3.select(this).text();
            });

        }
      });

      table
        .selectAll(".edit")
        .on("click", (d, i) => {
          dispatch.call("remove", null, d, i);
        });
    });
  }

  d3.rebind(exports, dispatch, "on");

  return exports;
}

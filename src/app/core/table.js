var Table = function module() {
    var dispatch = d3.dispatch("edit", "remove");

    function exports(_selection) {
        _selection.each(function (_dataset) {

            //________________________________________________
            // Data
            //________________________________________________
            var data = _dataset[0];
            var columnNames = _dataset[1];

            //________________________________________________
            // Table
            //________________________________________________
            
            var table = d3.select(this).selectAll("table").data([0])
            table = table.enter().append('table').merge(table);

            var dataRows = table.selectAll('tr.row').data(data, d => d.index);
            dataRows.exit().remove();

            var newDataRows = dataRows.enter()
              .append('tr')
              .attr('class', 'row');

            newDataRows.append('th')
              .attr('class', 'edit')
              .append('a')
              .text('×');

            var rows = newDataRows.selectAll('tr.row-data').data(d => d.data.map(_d => ({
                value: _d,
                data: d.data
              })), d => d.value)
              .enter().append('tr')
              .attr('class', 'row-data')

            rows
              .append('th')
              .attr('class', 'header .no-select')
              .text((d, i) => columnNames[i])

            rows
              .append('td')
              .attr('class', 'cell')
              .attr('contenteditable', true)
              .text(d => d.value)
              .on("keyup", function(d, i){
                d.data[i] = d.value = d3.select(this).text();
                  // var newData = [];
                  // d3.select('.table').selectAll('tr.row').selectAll('td')
                  //     .each(function(d, i, pI){
                  //         var text = d3.select(this).text();
                  //         if (typeof newData[pI] == 'undefined') newData[pI] = [];
                  //         newData[pI].push(text)
                  //     });
                  //dispatch.edit(newData);
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
};

export default Table;
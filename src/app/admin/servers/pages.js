import { supabaseClient as supabase } from "./../../auth/supabase.service";
import { initTranslator } from "./../../core/language.js";
import { getAvailableDatasets } from "./waffle-helpers.js";
import { observable, autorun } from 'mobx';

const readersSchema = {
  "ddfbw": ["service", "dataset", "name", "version", "translateContributionLink"],
  "ddfcsv": ["path"],
  "google_csv": ["path", "sheet", "timeInColumns", "hasNameColumn", "nameColumnIndex"],
  "csv": ["path", "timeInColumns", "hasNameColumn", "nameColumnIndex"]
};

const readersPickFields = {
  "ddfbw": {
    "service": { 
      getter: async () => (await getServers()).map(s => s.url),
      selected: observable({value: null})
    },
    "dataset": {
      parent: "service",
      getter: async (url) => await getAvailableDatasets(url),
      selected: observable({value: null})
    }
  }
}

const state = observable({
  projectId: null,
  pageId: null,
  subpanelId: 'toolset'
});

async function getServers(token){ 
  const { data, error } = await supabase
    .from('servers')
    .select('*')
    .neq('id', '__all__');   // or whatever sentinel you chose

  if (error) console.error(error);
  return data;
}

const panel = d3.select('#pages');
const pageButtonsContainer = panel.append('div').attr('class', 'pages-buttons');

async function loadPages(projectId) {
  const { data: pages, error } = await supabase
    .from('pages')
    .select('*')
    .eq('project_id', projectId);

  if (error) {
    console.error('Error fetching pages', error);
    return;
  }

  pageButtonsContainer.html('');
  subpanelContent.html('');
  
  state.pageId = pages.length > 0 ? pages[0].id : null;
  
  const actionsEl = d3.select('.pages-header .pages-actions');
  actionsEl.html('');
  actionsEl.append("span")
    .attr("class", "button")
    .text("Add Page")
    .on("click", async () => {
      PageView.renderAddForm(projectId);
    });
  actionsEl.append("span")
    .attr("class", "button")
    .text("Delete Page")
    .on("click", async () => {
      if (!state.pageId) return;
      PageView.renderDeleteForm(state.pageId);
    });

  const buttons = pageButtonsContainer.selectAll('button')
    .data(pages, d => d.id);

  buttons.enter()
    .append('span')
    .attr('class', 'button page-button')
    .classed('active', d => d.id === state.pageId)
    .text(d => d.name)
    .on('click', (event, d) => {
      pageButtonsContainer.selectAll('.page-button').classed('active', false);
      d3.select(event.target).classed('active', true);
      state.pageId = d.id;
    });

  autorun(() => {
    buttons.classed('active', d => d.id === state.pageId);
    if (state.pageId) {
      loadSubpanelContent(state.subpanelId, state.pageId);
    } else {
      subpanelContent.html('');
    }
  });
}

async function addPage(projectId, name) {
  const { error } = await supabase
    .from('pages')
    .insert([{ project_id: projectId, name }]);
  if (error) {
    console.error('Error adding page', error);
    return;
  }
  loadPages(projectId);
}

async function deletePage(pageId) {
  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', pageId);
  if (error) {
    console.error('Error deleting page', error);
    return;
  }
  loadPages(state.projectId);
}

const PageView = {
  renderAddForm(projectId) {
    d3.select('.pages-header .pages-actions').style("visibility", "hidden");
    const form = d3.select('.pages-buttons')
      .append('span')
      .attr('class', 'button page-button add-form');
    form.append('input')
      .attr('type', 'text')
      .attr('placeholder', 'Page Name')
      .attr('id', 'new-page-name');
    form.append('span')
      .attr('class', 'button')
      .text('Save')
      .on('click', () => {
        const name = form.select('#new-page-name').node().value;
        if (name) {
          form.remove();
          d3.select('.pages-header .pages-actions').style("visibility", null);
          addPage(projectId, name);
        }
      });
    form.append('span')
      .attr('class', 'button')
      .text('Cancel')
      .on('click', () => {
        form.remove();
        d3.select('.pages-header .pages-actions').style("visibility", null);
      });
  },
  renderDeleteForm(pageId) {
    const actionsEl = d3.select('.pages-header .pages-actions');
    actionsEl.html('');
    actionsEl.append('span')
      .attr('class', 'button delete')
      .text('Confirm Delete')
      .on('click', () => {
        deletePage(pageId);
      });
    actionsEl.append('span')
      .attr('class', 'button')
      .text('Cancel')
      .on('click', () => {
        actionsEl.html('');
        actionsEl.append("span")
          .attr("class", "button")
          .text("Add Page")
          .on("click", async () => {
            PageView.renderAddForm(state.projectId);
          });
        actionsEl.append("span")
          .attr("class", "button")
          .text("Delete Page")
          .on("click", async () => {
            if (!state.pageId) return;
            PageView.renderDeleteForm(state.pageId);
          });
      });
  }
};


const navContainer = panel.append('div')
  .attr('class', 'nav-container');

const subpanels = ['toolset', 'datasources', 'related', 'config'];

navContainer.selectAll('a')
  .data(subpanels)
  .enter()
  .append('a')
  .attr('href', '#')
  .style('margin-right', '10px')
  .text(d => d)
  .classed('active', d => d === state.subpanelId)
  .on('click', (event, d) => {
    event.preventDefault();
    d3.selectAll('.nav-container a').classed('active', false);
    d3.select(event.target).classed('active', true);
    state.subpanelId = d;
  });

const subpanelContent = panel.append('div')
  .attr('class', 'subpanel-content');

function loadSubpanelContent(panelName, pageId) {
  subpanelContent.html('');

  if (panelName === 'datasources') {
    loadDatasources(pageId);
  } else {
    subpanelContent.append('p')
      .text(`Content for ${panelName} subpanel.`);
  }
}

const DataSourceModel = {
  async fetch(pageId) {
    const { data, error } = await supabase
      .from('datasources')
      .select('*')
      .eq('page_id', pageId);
    return { data, error };
  },
  async add(pageId, dsId, reader, properties) {
    const { error } = await supabase
      .from('datasources')
      .insert([{ page_id: pageId, ds_id: dsId, reader, reader_properties: properties }]);
    return { error };
  },
  async update(id, pageId, updatedData) {
    const { error } = await supabase
      .from('datasources')
      .update([{ page_id: pageId, ...updatedData }])
      .eq("id", id);
    return { error };
  },
  async delete(id) {
    const { error } = await supabase
      .from('datasources')
      .delete()
      .eq("id", id);
    return { error };
  }
};

const DataSourceView = {
  renderTable(dataSources, pageId, onEdit, onDelete) {
    subpanelContent.html('');

    const table = subpanelContent.append('table').attr('class', 'admin-table datasource-table');
    const headerRow = table.append('tr');
    ['id', 'reader', 'properties', 'actions'].forEach(col => {
      headerRow.append('th').text(col);
    });

    const rows = table.selectAll('tr.data-row')
      .data(dataSources)
      .enter()
      .append('tr')
      .attr('class', 'data-row');

    rows.each(function(d) {
      const row = d3.select(this);
      row.append('td').text(d.ds_id);
      row.append('td').text(d.reader);
      row.append('td').text(JSON.stringify(d.reader_properties)
        .replaceAll('","', '", "')
        .replaceAll('":"', '": "')
        .replaceAll('{"', '{ "')
        .replaceAll('"}', '" }')
      );
      const actionsCell = row.append('td')
        .attr("class", "actions-cell");
      actionsCell.append('span')
        .text('Edit')
        .attr('class', 'button edit-datasource-button')
        .on('click', () => onEdit(d, row));
      actionsCell.append('span')
        .text('Delete')
        .attr('class', 'button edit-datasource-button')
        .on('click', () => onDelete(d, row));
    });

    subpanelContent.append('span')
      .text('Add Datasource')
      .attr('class', 'button add-datasource-button')
      .on('click', event => {
        d3.select(event.target).remove();
        this.renderAddForm(pageId, table);
      });
  },
  renderAddForm(pageId, table) {
    const form = table.append('tr')
      .attr('class', 'data-row add-form');

    form.append('td').append('input')
      .attr('type', 'text')
      .attr('placeholder', 'Reader')
      .attr('id', 'new-ds-id');

    const newReaderSelect = form.append('td').append('select').attr('id', 'new-reader');
    newReaderSelect.selectAll('option')
      .data(Object.keys(readersSchema))
      .enter()
      .append('option')
      .attr('value', d => d)
      .text(d => d);

    const dynamicFormState = observable({
      selectedReader: newReaderSelect.node().value || Object.keys(readersSchema)[0]
    });

    newReaderSelect.on('change', (event) => {
      dynamicFormState.selectedReader = event.target.value;
    });

    const cell = form.append('td').attr('class', 'properties-cell');

    autorun(() => {
      cell.selectAll('.dynamic-field').remove();
      const selected = dynamicFormState.selectedReader;
      readersSchema[selected].forEach(field => {
        if (readersPickFields[selected] && readersPickFields[selected][field]) {
          const selectField = cell.append('select')
            .attr('class', 'dynamic-field')
            .attr('id', `new-${field}`)
            .on('change', (event) => {
              readersPickFields[selected][field].selected.value = event.target.value;
            });
          autorun(() => {
            const parentField = readersPickFields[selected][field].parent;
            const parentValue = readersPickFields[selected][parentField]?.selected.value;
            selectField.selectAll("option").remove();
            if (parentField && parentValue === null) return;
            readersPickFields[selected][field].getter(parentValue).then(options => {
              readersPickFields[selected][field].selected.value = options[0] || null;
              selectField.selectAll('option')
                .data(options)
                .enter()
                .append('option')
                .attr('value', d => d)
                .text(d => d);
            });
          });
        } else {
          cell.append('input')
            .attr('class', 'dynamic-field')
            .attr('type', 'text')
            .attr('placeholder', field)
            .attr('id', `new-${field}`);
        }
      });
    });

    const actionsCell = form.append('td')
      .attr("class", "actions-cell");
    actionsCell.append('span')
      .attr('class', 'button')
      .text('Save')
      .on('click', async () => {
        const newDsId = form.select('#new-ds-id').node().value;
        const newReader = form.select('#new-reader').node().value;
        const properties = {};
        for (const field of readersSchema[newReader]) {
          const fieldValue = form.select(`#new-${field}`).node().value;
          if (fieldValue) properties[field] = fieldValue;
        }
        await DataSourceController.addDatasource(pageId, newDsId, newReader, properties);
      });

    actionsCell.append('span')
      .attr('class', 'button')
      .text('Cancel')
      .on('click', () => DataSourceController.loadDatasources(pageId));
  },
  renderEditForm(pageId, dsData, row) {
    row.html('');
    row.classed("edit-form", true);

    row.append('td')
      .append('input')
      .attr('type', 'text')
      .attr('value', dsData.ds_id)
      .attr('id', 'edit-ds-id');

    const readerCell = row.append('td');
    const newReaderSelect = readerCell.append('select').attr('id', 'edit-reader');
    newReaderSelect.selectAll('option')
      .data(Object.keys(readersSchema))
      .enter()
      .append('option')
      .attr('value', d => d)
      .text(d => d);
    newReaderSelect.property('value', dsData.reader);

    const dynamicFormState = observable({
      selectedReader: newReaderSelect.node().value || Object.keys(readersSchema)[0]
    });

    newReaderSelect.on('change', (event) => {
      dynamicFormState.selectedReader = event.target.value;
    });

    const cell = row.append('td').attr('class', 'properties-cell');

    autorun(() => {
      cell.selectAll('.dynamic-field').remove();
      const selected = dynamicFormState.selectedReader;
      readersSchema[selected].forEach(field => {
        if (readersPickFields[selected] && readersPickFields[selected][field]) {
          const selectField = cell.append('select')
            .attr('class', 'dynamic-field')
            .attr('id', `edit-${field}`)
            .on('change', (event) => {
              readersPickFields[selected][field].selected.value = event.target.value;
            });
          autorun(() => {
            const parentField = readersPickFields[selected][field].parent;
            const parentValue = readersPickFields[selected][parentField]?.selected.value;
            selectField.selectAll("option").remove();
            if (parentField && parentValue === null) return;
            readersPickFields[selected][field].getter(parentValue).then(options => {
              readersPickFields[selected][field].selected.value = dsData.reader_properties[field] || null;
              selectField.selectAll('option')
                .data(options)
                .enter()
                .append('option')
                .attr('value', d => d)
                .text(d => d);
              selectField.property("value", dsData.reader_properties[field]);
            });
          });
        } else {
          cell.append('input')
            .attr('class', 'dynamic-field')
            .attr('type', 'text')
            .attr('placeholder', field)
            .attr('id', `edit-${field}`)
            .property("value", dsData.reader_properties[field]);
        }
      });
    });

    const actionsCell = row.append('td')
      .attr("class", "actions-cell");
    actionsCell.append('span')
      .attr('class', "button")
      .text('Save')
      .on('click', async () => {
        const updatedReader = row.select('#edit-reader').node().value;
        const updatedDsId = row.select('#edit-ds-id').node().value;
        const properties = {};
        for (const field of readersSchema[updatedReader]) {
          const fieldValue = row.select(`#edit-${field}`).node().value;
          if (fieldValue) properties[field] = fieldValue;
        }
        const updatedData = { ds_id: updatedDsId, reader: updatedReader, reader_properties: properties};
        await DataSourceController.updateDatasource(dsData.id, pageId, updatedData);
      });
    actionsCell.append('span')
      .attr('class', "button")
      .text('Cancel')
      .on('click', () => DataSourceController.loadDatasources(pageId));
  },
  renderDeleteForm(pageId, dsData, row) {
    row.select(".actions-cell").html('');
    const actionsCell = row.select(".actions-cell");
    actionsCell.append('span')
      .attr('class', "button delete")
      .text('Delete')
      .on('click', async () => {
        await DataSourceController.deleteDatasource(dsData.id, pageId);
      });
    actionsCell.append('span')
      .attr('class', "button")
      .text('Cancel')
      .on('click', () => DataSourceController.loadDatasources(pageId));
  }
};

const DataSourceController = {
  async loadDatasources(pageId) {
    const { data, error } = await DataSourceModel.fetch(pageId);
    if (error) {
      subpanelContent.html('');
      subpanelContent.append('p').text('Error loading datasources.');
      console.error('Error fetching datasources', error);
      return;
    }
    DataSourceView.renderTable(data, pageId, (dsData, row) => {
      DataSourceView.renderEditForm(pageId, dsData, row);
    }, (dsData, row) => {
      DataSourceView.renderDeleteForm(pageId, dsData, row);
    });
  },
  async addDatasource(pageId, dsId, reader, properties) {
    const { error } = await DataSourceModel.add(pageId, dsId, reader, properties);
    if (error) console.error('Error inserting datasource', error);
    this.loadDatasources(pageId);
  },
  async updateDatasource(id, pageId, updatedData) {
    const { error } = await DataSourceModel.update(id, pageId, updatedData);
    if (error) console.error('Error updating datasource', error);
    this.loadDatasources(pageId);
  },
  async deleteDatasource(id, pageId) {
    const { error } = await DataSourceModel.delete(id);
    if (error) console.error('Error updating datasource', error);
    this.loadDatasources(pageId);
  }
};

async function loadDatasources(pageId) {
  DataSourceController.loadDatasources(pageId);
}

state.projectId = 1;
loadPages(state.projectId);

import { supabaseClient as supabase } from "./../../auth/supabase.service";
import { initTranslator } from "./../../core/language.js";
import { getDatasets } from "./waffle-helpers.js";
import { observable, autorun } from 'mobx';

const state = {
  projectId: null,
  pageId: null,
  subpanelId: 'toolset'
};

async function getServers(token){ 
  const { data, error } = await supabase
    .from('servers')
    .select('*')
    .neq('id', '__all__');   // or whatever sentinel you chose

  if (error) console.error(error);
  return data;
}

const panel = d3.select('#pages');
const pageButtonsContainer = panel.append('div');

async function loadPages(projectId) {
  const { data: pages, error } = await supabase
    .from('pages')
    .select('*')
    .eq('project_id', projectId);

  if (error) {
    console.error('Error fetching pages', error);
    return;
  }

  state.pageId = pages.length > 0 ? pages[0].id : null;
  
  const buttons = pageButtonsContainer.selectAll('button')
    .data(pages, d => d.id);

  buttons.enter()
    .append('button')
    .attr('class', 'page-button')
    .text(d => d.name)
    .on('click', (event, d) => {
      state.pageId = d.id;
    });
}

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
  .on('click', (event, d) => {
    event.preventDefault();
    loadSubpanelContent(d, state.pageId);
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

async function loadDatasources(pageId) {

  const readersSchema = {
    "ddfcsv": ["path"],
    "csv": ["path", "timeInColumns", "hasNameColumn", "nameColumnIndex"],
    "google_csv": ["path", "sheet", "timeInColumns", "hasNameColumn", "nameColumnIndex"],
    "ddfbw": ["service", "dataset", "name", "version", "translateContributionLink"]
  };

  const readersPickFields = {
    "ddfbw": {
      "service": { 
        getter: async () => (await getServers()).map(s => s.url),
        selected: observable({value: null})
      },
      "dataset": {
        parent: "service",
        getter: async (url) => await getDatasets("", url).then(d => d.map(ds => ds.slug)),
        selected: observable({value: null})
      }
    }
  }

  const { data: datasets, error } = await supabase
    .from('datasets')
    .select('*')
    .eq('page_id', pageId);

  if (error) {
    console.error('Error fetching datasets', error);
    subpanelContent.append('p')
      .text('Error loading datasets.');
    return;
  }

  subpanelContent.append('button')
    .text('Add Dataset')
    .attr('class', 'add-dataset-button')
    .on('click', () => {
      const form = subpanelContent.append('div')
        .attr('class', 'dataset-form');
      
      form.append('input')
        .attr('type', 'text')
        .attr('placeholder', 'Reader')
        .attr('id', 'new-id-reader');
      
      const newReaderSelect = form.append('select')
        .attr('placeholder', 'Reader')
        .attr('id', 'new-reader');
      newReaderSelect.append("button")
        .append("selectedcontent")
      newReaderSelect.selectAll('option')
        .data(Object.keys(readersSchema))
        .enter()
        .append('option')
        .attr('value', d => d)
        .text(d => d);

      const dynamicFormState = observable({
        selectedReader: newReaderSelect.node().value || Object.keys(readersSchema)[0],
      });

      newReaderSelect.on('change', (event) => {
        dynamicFormState.selectedReader = event.target.value;
      });

      autorun(() => {
        form.selectAll('.dynamic-field').remove();

        const selected = dynamicFormState.selectedReader;

        readersSchema[selected].forEach(field => {
          if (readersPickFields[selected] && readersPickFields[selected][field]) {
            const selectField = form.append('select')
              .attr('class', 'dynamic-field')
              .attr('id', `new-${field}`)
              .on('change', (event) => {
                readersPickFields[selected][field].selected.value = event.target.value;
              });
            autorun(() => {
              const parentField = readersPickFields[selected][field].parent;
              const parentValue = readersPickFields[selected][parentField]?.selected.value;
              form.select(`#new-${field}`).selectAll("option").remove();
              if (parentValue === null && parentField) return;
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
            form.append('input')
              .attr('class', 'dynamic-field')
              .attr('type', 'text')
              .attr('placeholder', field)
              .attr('id', `new-${field}`);
          }
        });
      });

      dynamicFormState.selectedReader = newReaderSelect.node().value || Object.keys(readersSchema)[0];
      
      form.append('button')
        .text('Save')
        .on('click', async () => {
          const newReader = form.select('#new-reader').node().value;
          const newLink = form.select('#new-link').node().value;
          const { error } = await supabase
            .from('datasets')
            .insert([{ page_id: pageId, reader: newReader, link: newLink }]);
          if (error) {
            console.error('Error inserting dataset', error);
          } else {
            form.remove();
            loadDatasources(pageId);
          }
        });
      
      form.append('button')
        .text('Cancel')
        .on('click', () => form.remove());
    });

  const table = subpanelContent.append('table')
    .attr('class', 'datasource-table');

  const headerRow = table.append('tr');
  ['id', 'reader', ''].forEach(col => {
    headerRow.append('th').text(col);
  });

  const rows = table.selectAll('tr.data-row')
    .data(datasets)
    .enter()
    .append('tr')
    .attr('class', 'data-row');

  rows.each(function(d) {
    const row = d3.select(this);
    ['id', 'reader', ''].forEach(key => {
      row.append('td').text(d[key]);
    });
  });

  rows.append('td')
    .append('button')
    .text('Edit')
    .attr('class', 'edit-dataset-button')
    .on('click', function(event, d) {
      const currentRow = d3.select(this.parentNode.parentNode);
      currentRow.html('');
      currentRow.append('td')
        .append('input')
        .attr('type', 'text')
        .attr('value', d.reader)
        .attr('id', 'edit-reader');
      currentRow.append('td')
        .append('input')
        .attr('type', 'text')
        .attr('value', d.link)
        .attr('id', 'edit-link');
      currentRow.append('td')
        .append('button')
        .text('Save')
        .on('click', async () => {
          const updatedReader = currentRow.select('#edit-reader').node().value;
          const updatedLink = currentRow.select('#edit-link').node().value;
          const { error } = await supabase
            .from('datasets')
            .insert([{ page_id: pageId, reader: updatedReader, link: updatedLink }]);
          if (error) {
            console.error('Error inserting updated dataset', error);
          } else {
            loadDatasources(pageId);
          }
        });
      currentRow.append('td')
        .append('button')
        .text('Cancel')
        .on('click', () => loadDatasources(pageId));
    });

}

state.projectId = 1;
loadPages(state.projectId);

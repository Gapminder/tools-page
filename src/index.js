import "./app/app.styl";

import DDFCsvReader from "vizabi-ddfcsv-reader/dist/vizabi-ddfcsv-reader";
import CsvReader from "vizabi-csv-reader/dist/vizabi-csv-reader";
import "vizabi-ddfservice-reader/dist/vizabi-ddfservice-reader";
import "d3/dist/d3";
import "urlon/dist/urlon.umd";
import "vizabi-reactive/dist/Vizabi.js";
import "mobx/lib/mobx.umd";
import "vizabi-shared-components/build/VizabiSharedComponents.js";

import "tools";

import "../node_modules/vizabi-config-systema_globalis/dist/*.json";

import "properties";
import "toolset";
import "datasources";

import "./app/d3extensions.js";
import "./app/app.js";


window.Vizabi = window.Vizabi || Vizabi;
window.d3 = window.d3 || d3;
window.urlon = window.urlon || urlon;

//DDFCSV reader integration
const ddfReader = new DDFCsvReader.getDDFCsvReaderObject();
Vizabi.stores.dataSources.createAndAddType("ddfcsv", ddfReader);

//External CSV reader integration
//Vizabi.stores.dataSources.createAndAddType("csv", CsvReader.csvReaderObject);

//Excel reader integration
//Vizabi.stores.dataSources.createAndAddType("excel", ExcelReader.excelReaderObject);

// BW reader integration
Vizabi.stores.dataSources.createAndAddType("ddfbw", DDFServiceReader.getReader());


window.VIZABI_PAGE_MODEL = null;

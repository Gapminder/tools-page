import "core-js";
import "regenerator-runtime/runtime.js";
import "./app/app.styl";

import "d3/dist/d3";
import "urlon/dist/urlon.umd";

//'vizabi' should be imported at first because it fully polyfilled TODO: does it apply to new vizabi?
import "vizabi-reactive/dist/Vizabi.js";
import "mobx/lib/mobx.umd";
import "vizabi-shared-components/build/VizabiSharedComponents.js";

import "vizabi-tools";
import "vizabi-ddfservice-reader/dist/vizabi-ddfservice-reader";
import DDFCsvReader from "vizabi-ddfcsv-reader/dist/vizabi-ddfcsv-reader";

import "../node_modules/vizabi-config-systema_globalis/dist/*.json";

import "properties";
import "toolset";
import "datasources";

import "./app/d3extensions.js";
import App from "./app/app.js";

// window.Vizabi = window.Vizabi || Vizabi;
// window.d3 = window.d3 || d3;
// window.urlon = window.urlon || urlon;

//DDFCSV reader integration
const ddfReader = new DDFCsvReader.getDDFCsvReaderObject();
Vizabi.stores.dataSources.createAndAddType("ddfcsv", ddfReader);

//Excel reader integration
//Vizabi.stores.dataSources.createAndAddType("excel", ExcelReader.excelReaderObject);

// BW reader integration
Vizabi.stores.dataSources.createAndAddType("ddfbw", DDFServiceReader.getReader());


window.js = mobx.toJS;
window.VIZABI_PAGE_MODEL = null;
App();

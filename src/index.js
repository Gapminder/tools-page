import "core-js/stage/3";
import "core-js/es/array/flat"; //safari11
import "core-js/es/array/flat-map";
import "core-js/es/object/from-entries"; //safari11
import "regenerator-runtime/runtime.js";
import "./app/app.styl";

import "~d3";
import "~mobx";
import "urlon/dist/urlon.umd";

import "@vizabi/core/dist/Vizabi.js";
import "@vizabi/shared-components/build/VizabiSharedComponents.js";

import "vizabi-tools";
import "@vizabi/reader-ddfservice/dist/reader-ddfservice.js";
import "@vizabi/reader-ddfcsv/dist/reader-ddfcsv.js";

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

// Use preserveDrawingBuffer=true to allow saving canvas as image
HTMLCanvasElement.prototype.getContext = (function(origFn) {
  return function(type, attribs, ...args) {
    const newAttribs = { ...(attribs || {}), preserveDrawingBuffer: true };
    return origFn.call(this, type, newAttribs, ...args);
  };
}) (HTMLCanvasElement.prototype.getContext);

window.js = mobx.toJS;
App(toolsPage_properties);

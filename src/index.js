import "./app/index.styl";
import "./app/d3extensions.js";
import App from "./app/app.js";
import toolsPage_properties from "toolsPage_properties";

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

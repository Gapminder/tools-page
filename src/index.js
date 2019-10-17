import './app/app.styl';
import './favicon.ico';

window.d3 = window.d3 || require('d3');
window.urlon = window.urlon || require('urlon');
window.Vizabi = window.Vizabi || require('vizabi');
window.DDFCsvReader = window.DDFCsvReader || require('vizabi-ddfcsv-reader');
window.CsvReader = window.CsvReader || require('vizabi-csv-reader');
window.DDFServiceReader = window.DDFServiceReader || require('vizabi-ddfservice-reader');


// BW reader integration
var bwReader = DDFServiceReader.getReader();
Vizabi.Reader.extend("ddfbw", bwReader);
//DDFCSV reader integration
var ddfReader = new DDFCsvReader.getDDFCsvReaderObject()
Vizabi.Reader.extend("ddf", ddfReader);
//CSV reader integration
Vizabi.Reader.extend("csv", CsvReader.csvReaderObject);
//Google spreadsheet CSV reader integration, same as normal csv 
Vizabi.Reader.extend("google_csv", CsvReader.csvReaderObject);

require('vizabi/build/vizabi.css');

var requireChartConfigs = require.context('vizabi-config-systema_globalis/dist', false, /\.json$/);
requireChartConfigs.keys().forEach(requireChartConfigs);

window.VIZABI_PAGE_MODEL = null;
window.toolsPage_properties = window.toolsPage_properties || require("properties");
window.toolsPage_toolset = window.toolsPage_toolset || require("toolset");
window.toolsPage_datasources = window.toolsPage_datasources || require("datasources");
window.toolsPage_conceptMapping = window.toolsPage_conceptMapping || require("conceptMapping");
window.toolsPage_entitysetMapping = window.toolsPage_entitysetMapping || require("entitysetMapping");

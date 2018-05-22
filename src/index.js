import './app/app.styl';
import './favicon.ico';

window.d3 = window.d3 || require('d3');
window.urlon = window.urlon || require('urlon');
window.Vizabi = window.Vizabi || require('vizabi');
window.WsReader = window.WsReader || require('vizabi-ws-reader-web');
window.DDFCsvReader = window.DDFCsvReader || require('vizabi-ddfcsv-reader');

//WS reader integration
var wsReader = WsReader.WsReader.getReader();
Vizabi.Reader.extend("waffle", wsReader);
//DDFCSV reader integration
var ddfReader = new DDFCsvReader.getDDFCsvReaderObject()
Vizabi.Reader.extend("ddf", ddfReader);

require('vizabi/build/vizabi.css');

var requireChartConfigs = require.context('vizabi-config-systema_globalis/dist', false, /\.json$/);
requireChartConfigs.keys().forEach(requireChartConfigs);

window.VIZABI_PAGE_MODEL = null;
window.toolsPage_toolset = window.toolsPage_toolset || require("toolset");
window.toolsPage_datasources = window.toolsPage_datasources || require("datasources");
window.toolsPage_conceptMapping = window.toolsPage_conceptMapping || require("conceptMapping");

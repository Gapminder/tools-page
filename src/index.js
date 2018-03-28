import './app/app.styl';
import './favicon.ico';

window.d3 = window.d3 || require('d3');
window.urlon = window.urlon || require('urlon');
window.Vizabi = window.Vizabi || require('vizabi');
window.WsReader = window.WsReader || require('vizabi-ws-reader');
window.DDFCsvReader = window.DDFCsvReader || require('vizabi-ddfcsv-reader');

//WS reader integration
var wsReader = WsReader.WsReader.getReader();
Vizabi.Reader.extend("waffle", wsReader);
//DDFCSV reader integration
var ddfReader = new DDFCsvReader.getDDFCsvReaderObject()
Vizabi.Reader.extend("ddf", ddfReader);

require('vizabi-bubblechart');
require('vizabi-mountainchart');
require('vizabi-bubblemap');
require('vizabi-linechart');
require('vizabi-barrankchart');
require('vizabi-popbyage');

var requireChartConfigs = require.context('vizabi-config-systema_globalis/dist', false, /\.json$/);
requireChartConfigs.keys().forEach(requireChartConfigs);

import toolset from 'toolset';
import datasources from 'datasources';
window.toolsPage = { toolset, datasources };

//import 'styles.styl';
import './favicon.ico';

import 'vizabi-ddfcsv-reader/dist/vizabi-ddfcsv-reader';
import 'vizabi-ws-reader/dist/vizabi-ws-reader';
import 'd3/build/d3';

window.d3 = require('d3');
window.Vizabi = require('vizabi');
require('vizabi-bubblechart');
require('vizabi-mountainchart');
require('vizabi-bubblemap');
require('vizabi-linechart');
require('vizabi-barrankchart');
require('vizabi-popbyage');
require('index.html');

var requireNgToolsPageStyles = require.context('app', true, /\.styl$/);
requireNgToolsPageStyles.keys().forEach(requireNgToolsPageStyles);

var requireChartConfigs = require.context('vizabi-config-systema_globalis/dist', false, /\.json$/);
requireChartConfigs.keys().forEach(requireChartConfigs);

import toolset from 'toolset';
import datasources from 'datasources';
window.toolsPage = { toolset, datasources};
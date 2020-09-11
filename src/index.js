import './app/app.styl';

import 'd3/dist/d3';
import 'urlon/dist/urlon.umd';

//'vizabi' should be imported at first because it fully polyfilled
import 'vizabi/build/vizabi';
import "vizabi-tools";
import 'vizabi-ddfservice-reader/dist/vizabi-ddfservice-reader';
import DDFCsvReader from 'vizabi-ddfcsv-reader/dist/vizabi-ddfcsv-reader';
import CsvReader from 'vizabi-csv-reader/dist/vizabi-csv-reader';

import '../node_modules/vizabi-config-systema_globalis/dist/*.json';

import "properties";
import "toolset";
import "datasources";
import App from './app/app.js';

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

window.VIZABI_PAGE_MODEL = null;

App();

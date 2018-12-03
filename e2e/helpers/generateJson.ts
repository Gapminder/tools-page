const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const request = require('request-promise');
const getSourcesLink = 'https://waffle-server.gapminder.org/api/ddf/ql?_select_key@=concept;&value@=concept/_type&=domain&=source/_url&=source&=color&=scales&=tags&=name&=name/_short&=name/_catalog&=description;;&from=concepts&where_;&language=en';

function generateJsonDirs() {
    const jsonData = path.join(process.cwd(), 'e2e/test-data');
    if (!fs.existsSync(jsonData)) {
        mkdirp.sync(jsonData);
    }
}

async function generateJsonFile() {
    const recievedResponse = await request({
        "method": "GET",
        "uri": getSourcesLink,
        "json": true,
        "headers": {
            "User-Agent": ""
        }
    });

    const linksRows = recievedResponse.rows.map((data) => {
        return data[0]
    });

    const changedNames = linksRows.map((data) => {
        return data.replace(/_/g, '/_');
    });

    fs.writeFile('./e2e/test-data/queryParameters.json', JSON.stringify(changedNames));
}

function rimraf(dir_path) {
    if (fs.existsSync(dir_path)) {
        fs.readdirSync(dir_path).forEach(entry => {
            const entry_path = path.join(dir_path, entry);
            if (fs.lstatSync(entry_path).isDirectory()) {
                rimraf(entry_path);
            } else {
                fs.unlinkSync(entry_path);
            }
        });
        fs.rmdirSync(dir_path);
    }
}

rimraf(path.resolve(process.cwd(), './e2e/test-data'));
generateJsonDirs();
generateJsonFile();

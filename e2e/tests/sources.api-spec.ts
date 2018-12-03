let using = require('jasmine-data-provider');
let requestPromise = require('request-promise');
let sources = require('../test-data/queryParameters.json');

describe('API tests: ', () => {
    sources.forEach(async (data) => {
        it(data, async () => {
            let uri = 'https://waffle-server.gapminder.org/api/ddf/ql?_language=ru-RU&from=datapoints&animatable=time&gapfill:true&select_key@=country&=time;&value@=' + data + ';;&where_$and@_country=$country;;;&join_$country_key=country&where_un/_state:true;;;&order/_by@=time';
            const result = await requestPromise({
                "method": "GET",
                "uri": uri,
                "json": true,
                "headers": {
                    "User-Agent": ""
                }
            });
            expect(result.success).toBeTruthy();
        }, 15000)
    })
});

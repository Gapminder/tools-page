'use strict';
const url = process.env.URL || 'http://localhost:4200/tools/';
const device = process.env.DEVICE || 'desktop'; // 'desktop' or 'tablet' or 'mobile'

let screenSize = {
  desktop: true,
  tablet: false,
  mobile: false,
  width: 1920,
  height: 1080
};

if (device === 'desktop') {
  screenSize.desktop = true;
  screenSize.width = 1920;
  screenSize.height = 1080;
}

if (device === 'mobile') {
  screenSize.desktop = false;
  screenSize.mobile = true;
  screenSize.width = 375;
  screenSize.height = 667;
};

if (device === 'tablet') {
  screenSize.desktop = false;
  screenSize.tablet = true;
  screenSize.width = 768;
  screenSize.height = 1024;
};

exports.config = {
  // seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: [
    './e2e/**/*.e2e-spec.ts'
  ],
  exclude: ['./e2e/redirects-spec.js'],
  multiCapabilities: [
    {
      browserName: 'chrome',
      loggingPrefs: {
        'driver': 'INFO',
        'browser': 'INFO'
      },
      // shardTestFiles: true,
      // maxInstances: 2,
      chromeOptions: {
        args: ['no-sandbox', 'disable-infobars', 'headless']
      },
    },
    // crossbrowser testing:
    // selenium server should be started for safari, microsoftEdge and firefox. directConnect works correctly only with Chrome.
    // 
    // {
    //   browserName: 'firefox',
    //   "moz:firefoxOptions": {
    //     "args": ["-headless"],
    //   }
    // },
    // {
    //   browserName: 'MicrosoftEdge'
    // },
    // {
    //   browserName: 'safari'
    // },
    // mouseMove action is not implemented in safari
  ],

  directConnect: true,

  params: {
    desktop: screenSize.desktop,
    tablet: screenSize.tablet,
    mobile: screenSize.mobile,
    screenWidth: screenSize.width,
    screenHeight: screenSize.height
  },
  baseUrl: url,
  useAllAngular2AppRoots: true,
  allScriptsTimeout: 60000,
  getPageTimeout: 60000,
  SELENIUM_PROMISE_MANAGER: false,
  untrackOutstandingTimeouts: true,
  framework: 'jasmine',
  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 60000,
    print: function () {
    }
  },

  onPrepare: () => {
    browser.waitForAngularEnabled(false);
    require('ts-node').register({ project: 'e2e' });

    browser.driver.manage().window().setSize(screenSize.width, screenSize.height);

    let SpecReporter = require('jasmine-spec-reporter').SpecReporter;

    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: 'specs'
      }
    }));
  }
};

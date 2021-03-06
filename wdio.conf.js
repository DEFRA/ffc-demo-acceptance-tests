const { ReportAggregator, HtmlReporter } = require('@rpii/wdio-html-reporter')
const log4js = require('@log4js-node/log4js-api')
const logger = log4js.getLogger('default')
const envRoot = (process.env.TEST_ENVIRONMENT_ROOT_URL || 'https://ffc-demo.ffc-dev.aws-int.defra.cloud')

exports.config = {
  hostname: 'selenium',
  path: '/wd/hub',
  specs: ['./src/features/**/*.feature'],
  exclude: ['./src/scratch/**'],
  maxInstances: 10,
  capabilities: [{
    maxInstances: 5,
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: ['--headless', '--ignore-certificate-errors']
    }
  }],
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  logLevel: 'info',
  bail: 0,
  baseUrl: envRoot + '/selenium:4444',
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  services: ['selenium-standalone'],
  framework: 'cucumber',
  reporters: ['spec',
    [HtmlReporter, {
      debug: true,
      outputDir: './reports/html-reports/',
      filename: 'feature-report.html',
      reportTitle: 'Feature Test Report',
      showInBrowser: false,
      useOnAfterCommandForScreenshot: false,
      LOG: logger
    }]
  ],

  // If you are using Cucumber you need to specify the location of your step definitions.
  cucumberOpts: {
    require: ['./src/steps/**/*.js'], // <string[]> (file/dir) require files before executing features
    backtrace: false, // <boolean> show full backtrace for errors
    requireModule: ['@babel/register'], // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
    dryRun: false, // <boolean> invoke formatters without executing steps
    failFast: false, // <boolean> abort the run on first failure
    format: ['pretty'], // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
    colors: true, // <boolean> disable colors in formatter output
    snippets: true, // <boolean> hide step definition snippets for pending steps
    source: true, // <boolean> hide source uris
    profile: [], // <string[]> (name) specify the profile to use
    strict: false, // <boolean> fail if there are any undefined or pending steps
    tagExpression: '', // <string> (expression) only execute the features or scenarios with tags matching the expression
    timeout: 60000, // <number> timeout for step definitions
    ignoreUndefinedDefinitions: false // <boolean> Enable this config to treat undefined definitions as warnings.
  },

  // =====
  // Hooks
  // =====
  onPrepare: function (config, capabilities) {
    const reportAggregator = new ReportAggregator({
      outputDir: './reports/html-reports/',
      filename: 'acceptance-test-suite-report.html',
      reportTitle: 'Acceptance Tests Report',
      browserName: capabilities.browserName
      // to use the template override option, can point to your own file in the test project:
      // templateFilename: path.resolve(__dirname, '../template/wdio-html-reporter-alt-template.hbs')
    })
    reportAggregator.clean()

    global.reportAggregator = reportAggregator
  },

  onComplete: function (exitCode, config, capabilities, results) {
    (async () => {
      await global.reportAggregator.createReport()
    })()
  },

  beforeSession: function () {
    const chai = require('chai')

    global.expect = chai.expect
    global.assert = chai.assert
    global.should = chai.should()
  },

  afterTest: function (test) {
    const path = require('path')
    const moment = require('moment')

    // if test passed, ignore, else take and save screenshot.
    if (test.passed) {
      return
    }
    const timestamp = moment().format('YYYYMMDD-HHmmss.SSS')
    const filepath = path.join('reports/html-reports/screenshots/', timestamp + '.png')
    browser.saveScreenshot(filepath)
    process.emit('test:screenshot', filepath)
  }
}

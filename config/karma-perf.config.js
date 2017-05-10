const argv = require('yargs').argv
const project = require('./project.config')
const webpackConfig = require('./webpack.config')
const debug = require('debug')('app:config:karma')

debug('Creating configuration.')
const karmaConfig = {
  basePath : '../', // project root in relation to bin/karma.js
  captureTimeout: 60000,
  browserNoActivityTimeout: 30000,
  files    : [
    {
      pattern  : `./${project.dir_test}/perf-bundler.js`,
      watched  : false,
      served   : true,
      included : true
    }
  ],
  singleRun     : !argv.watch,
  frameworks    : ['benchmark'],
  reporters     : ['benchmark'],
  preprocessors : {
    [`${project.dir_test}/perf-bundler.js`] : ['webpack', 'sourcemap']
  },
  browsers : ['Chrome', 'Firefox', 'Safari'],
  webpack  : {
    devtool : 'inline-source-map',
    resolve : webpackConfig.resolve,
    plugins : webpackConfig.plugins,
    module: {
      rules : webpackConfig.module.rules
    }
  },
  webpackMiddleware : {
    noInfo : true
  }
}
module.exports = (cfg) => cfg.set(karmaConfig)

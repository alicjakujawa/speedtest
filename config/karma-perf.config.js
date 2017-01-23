const argv = require('yargs').argv
const project = require('./project.config')
const webpackConfig = require('./webpack.config')
const debug = require('debug')('app:config:karma')

debug('Creating configuration.')
const karmaConfig = {
  basePath : '../', // project root in relation to bin/karma.js
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
    [`${project.dir_test}/perf-bundler.js`] : ['webpack']
  },
  browsers : ['PhantomJS'],
  webpack  : {
    devtool : 'cheap-module-source-map',
    resolve : webpackConfig.resolve,
    plugins : webpackConfig.plugins,
    module: {
      loaders : webpackConfig.module.loaders
    }
  },
  webpackMiddleware : {
    noInfo : true
  }
}
module.exports = (cfg) => cfg.set(karmaConfig)

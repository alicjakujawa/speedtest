const webpack = require('webpack')
const project = require('./project.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
  context: project.paths.client(),
  entry: {
    app: project.paths.client('main.js')
  },
  output: {
    path: project.paths.dist(),
    filename: `[name].[${project.compiler_hash_type}].js`,
    publicPath : project.compiler_public_path
  },
  resolve: {
    modules: [
      project.paths.client(),
      'node_modules'
    ]
  },
  devtool : project.compiler_devtool,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude : /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: { presets: project.compiler_babel.presets }
        }]
      },
      {
        test: /\.(sass|scss)$/,
        exclude : /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin(project.globals),
    new HtmlWebpackPlugin({
      template : project.paths.client('index.html'),
      hash     : false,
      favicon  : project.paths.public('favicon.ico'),
      filename : 'index.html',
      inject   : 'body',
      minify   : {
        collapseWhitespace : true
      }
    })
  ]
}

/* eslint-disable */
config.module.rules.push(
  { test: /\.woff(\?.*)?$/,  loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff' },
  { test: /\.woff2(\?.*)?$/, loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' },
  { test: /\.otf(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype' },
  { test: /\.ttf(\?.*)?$/,   loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream' },
  { test: /\.eot(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]' },
  { test: /\.mp3$/,          loader: 'file-loader' },
  { test: /\.svg(\?.*)?$/,   loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' },
  { test: /\.(png|jpg)$/,    loader: 'url-loader?limit=8192' }
)
/* eslint-enable */

module.exports = config

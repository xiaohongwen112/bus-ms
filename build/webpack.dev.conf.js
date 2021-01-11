var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var _ = require('lodash');
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

let htmls = utils.htmlPlugin();

let somePages = process.argv.slice(2);
if (somePages.length === 0) {
  console.log('Run All Pages!');
} else {
  const allEntry = baseWebpackConfig.entry;
  let currentEntry = _.reduce(allEntry, function(r, v, k) {
    if (somePages.includes(k)) {
      r[k] = v;
      console.log(`------------run ${k}`);
    }
    return r;
  }, {});
  if (JSON.stringify(currentEntry) !== '{}') {
    baseWebpackConfig.entry = currentEntry;
  } else {
    // error tip
    console.error('NOT FOUND PAGES!');
    throw new Error('NOTFOUNDPAGE');
  }
}

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./vendor-manifest.json')
    }),
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html',
    //   inject: true
    // }),
    new FriendlyErrorsPlugin()
  ].concat(htmls)
})

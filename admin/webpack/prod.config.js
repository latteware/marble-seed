const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

const config = require('../../config')

const path = require('path')
const webpack = require('webpack')

module.exports = {
  context: __dirname,
  entry: [
    'babel-polyfill',
    '../frontend/index.js'
  ],
  output: {
    path: path.resolve('./admin/dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'stage-0', 'react']
        }
      },
      {
        test: /\.(css|scss)/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'bundle.css'
    }),
    new webpack.DefinePlugin({
      'ENV': JSON.stringify(config.env),
      'PREFIX': JSON.stringify(config.server.adminPrefix),
      'API_HOST': JSON.stringify(config.server.apiHost),
      'EMAIL_SEND': JSON.stringify(config.mailer.active),
      'BASE_TITLE': JSON.stringify(config.server.adminTitle)
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new UglifyWebpackPlugin({
      parallel: true
    }),
    new CompressionPlugin({algorithm: 'gzip'})
  ],
  resolve: {
    modules: ['node_modules'],
    alias: {
      '~base': path.resolve('./lib/frontend/'),
      '~core': path.resolve('./admin/frontend/core'),
      '~components': path.resolve('./admin/frontend/components')
    }
  }
}

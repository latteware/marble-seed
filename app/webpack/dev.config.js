const path = require('path')
const webpack = require('webpack')
const config = require('config')

module.exports = {
  context: __dirname,
  entry: [
    'babel-polyfill',
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    '../frontend/index.js'
  ],
  output: {
    path: __dirname,
    publicPath: '/assets',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0', 'react']
        }
      },
      {
        test: /\.(css|scss)/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      },
      {
        test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
        loader: 'file-loader'
      }
    ]
  },
  devtool: '#source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'ENV': JSON.stringify(config.env),
      'PREFIX': JSON.stringify(''),
      'API_HOST': JSON.stringify(config.server.apiHost),
      'EMAIL_SEND': JSON.stringify(config.mailer.active),
      'BASE_TITLE': JSON.stringify(config.server.adminTitle)
    })
  ],
  resolve: {
    modules: ['node_modules'],
    alias: {
      '~base': path.resolve('./lib/frontend/'),
      '~core': path.resolve('./app/frontend/core'),
      '~components': path.resolve('./app/frontend/components')
    }
  }
}

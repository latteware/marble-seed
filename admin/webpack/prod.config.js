const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const config = require('../../config')

const path = require('path')
const webpack = require('webpack')

module.exports = {
  context: __dirname,
  mode: 'production',
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
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new webpack.DefinePlugin({
      'ENV': JSON.stringify(config.env),
      'PREFIX': JSON.stringify(''),
      'API_HOST': JSON.stringify(config.server.apiHost),
      'EMAIL_SEND': JSON.stringify(config.mailer.active),
      'BASE_TITLE': JSON.stringify(config.server.adminTitle),
      'STORAGE_PREFIX': JSON.stringify(config.storage.prefix)
    })
  ],
  resolve: {
    modules: ['node_modules'],
    alias: {
      '~base': path.resolve('./lib/frontend/'),
      '~core': path.resolve('./admin/frontend/core'),
      '~components': path.resolve('./admin/frontend/components')
    }
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})]
  }
}

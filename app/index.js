const path = require('path')
const express = require('express')
const webpack = require('webpack')
const config = require('config')
const expressNunjucks = require('express-nunjucks')
const expressStaticGzip = require('express-static-gzip')

const webpackConfig = require('./webpack/dev.config')

const app = express()
app.set('views', path.resolve('./app/views'))

expressNunjucks(app, {
  noCache: false
})

if (config.env === 'development') {
  console.log('Starting server in development with webpack hot reload')

  const compiler = webpack(webpackConfig)
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath
  }))

  app.use(require('webpack-hot-middleware')(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  }))
} else {
  console.log(`Starting server in ${config.env} with static assets`)
  app.use('/assets', expressStaticGzip('app/dist'))
}

app.get('*', function (req, res) {
  res.render('index', {
    env: config.env,
    title: config.server.appTitle
  })
})

module.exports = app

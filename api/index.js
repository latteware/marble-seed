const config = require('config')

const Koa = require('koa')
const logger = require('koa-logger')
const convert = require('koa-convert')
const cors = require('koa-cors')
const Router = require('koa-oai-router')

const routers = require('./routers')
const { errorHandler, getRequestData } = require('./middlewares')
const { sanitizeBody } = require('lib/middlewares')
const middleware = require('koa-oai-router-middleware')

const router = new Router({
  apiDoc: './api'
})

router.mount(middleware, './routers/user')

const { env } = config

const app = new Koa()

if (env !== 'test') {
  app.use(logger())
}

app.use(convert(cors()))

app.use(sanitizeBody)
app.use(errorHandler)
app.use(getRequestData)
app.use(router.routes())
// api routers
routers(app)

module.exports = app

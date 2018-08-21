const lov = require('lov')
const _ = require('lodash')
const router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const convert = require('koa-convert')

const Route = class {
  constructor (options) {
    this._isRoute = true
    this.options = options || {}

    this.method = this.options.method
    this.path = this.options.path
    this.validator = this.options.validator
    this.handler = this.options.handler
    this.priority = this.options.priority || 1
    this.middlewares = this.options.middlewares || []
    this.bodySize = this.options.bodySize || '1mb'
  }

  add (app) {
    const route = this
    const rtr = router()

    rtr.use(convert(bodyParser({
      strict: false,
      formLimit: route.bodySize,
      jsonLimit: route.bodySize
    })))

    // Add route base data
    rtr.use(async function (ctx, next) {
      ctx.route = {
        method: route.method,
        path: route.path
      }

      await next()
    })

    _.forEach(route.middlewares, mdw => {
      rtr.use(mdw)
    })

    rtr[route.method](route.path, async function (ctx) {
      if (route.validator) {
        const result = lov.validate(ctx.request.body, route.validator)

        if (result.error) {
          return ctx.throw(422, result.error.message)
        }
      }

      await route.handler(ctx)
    })

    app.use(rtr.middleware())
  }
}

module.exports = Route

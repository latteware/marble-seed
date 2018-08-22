const _ = require('lodash')
const Route = require('lib/router/route')

const {AppConfig} = require('models')

module.exports = new Route({
  method: 'post',
  path: '/:key',
  handler: async function (ctx) {
    const key = ctx.params.key
    const data = ctx.request.body

    const config = await AppConfig.findOne({key})
    ctx.assert(config, 404, 'Group not found')

    if (data.value !== undefined) {
      if (config.type === 'boolean' && !_.isBoolean(data.value)) {
        return ctx.throw(422, 'invalid boolean')
      }

      if (config.type === 'number' && !_.isNumber(data.value)) {
        return ctx.throw(422, 'invalid number')
      }

      if (config.type === 'string' && !_.isString(data.value)) {
        return ctx.throw(422, 'invalid string')
      }

      if (config.type === 'array' && !_.isArray(data.value)) {
        return ctx.throw(422, 'invalid array')
      }

      if (config.type === 'object' && !_.isObject(data.value)) {
        return ctx.throw(422, 'invalid object')
      }
    }

    config.value = data.value
    await config.save()

    ctx.body = config.toAdmin()
  }
})

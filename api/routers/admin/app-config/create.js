const Route = require('lib/router/route')
const lov = require('lov')
const _ = require('lodash')

const {AppConfig} = require('models')

module.exports = new Route({
  method: 'post',
  path: '/',
  validator: lov.object().keys({
    key: lov.string().required(),
    type: lov.string().required()
  }),
  handler: async function (ctx) {
    var data = ctx.request.body

    if (!AppConfig.validateType(data.type)) {
      return ctx.throw(422, 'invalid type')
    }

    if (!AppConfig.validateKey(data.key)) {
      return ctx.throw(422, 'invalid key format')
    }

    if (data.type === 'boolean' && !_.isBoolean(data.value)) {
      return ctx.throw(422, 'invalid boolean')
    }

    if (data.type === 'number' && !_.isNumber(data.value)) {
      return ctx.throw(422, 'invalid number')
    }

    if (data.type === 'string' && !_.isString(data.value)) {
      return ctx.throw(422, 'invalid string')
    }

    if (data.type === 'array' && !_.isArray(data.value)) {
      return ctx.throw(422, 'invalid array')
    }

    if (data.type === 'object' && !_.isObject(data.value)) {
      return ctx.throw(422, 'invalid object')
    }

    const existingKey = await AppConfig.findOne({key: data.key})
    if (existingKey) {
      return ctx.throw(412, 'key already exits')
    }

    const config = await AppConfig.create(data)

    ctx.body = config.toAdmin()
  }
})

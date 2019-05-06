const Route = require('lib/router/route')
const lov = require('lov')

const { Translation } = require('models')

module.exports = new Route({
  method: 'post',
  path: '/',
  validator: lov.object().keys({
    id: lov.string().required()
  }),
  handler: async function (ctx) {
    let data = ctx.request.body

    const translation = await Translation.create(data)

    ctx.body = {
      data: translation.toAdmin()
    }
  }
})

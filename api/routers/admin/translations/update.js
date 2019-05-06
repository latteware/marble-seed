const Route = require('lib/router/route')
const lov = require('lov')

const { Translation } = require('models')

module.exports = new Route({
  method: 'post',
  path: '/:uuid',
  validator: lov.object().keys({
    id: lov.string().required()
  }),
  handler: async function (ctx) {
    const {uuid} = ctx.params
    let data = ctx.request.body

    const translations = await Translation.findOne({ 'uuid': uuid })
    ctx.assert(translations, 404, 'Group not found')

    translations.set(data)
    await translations.save()

    ctx.body = {
      data: translations.toAdmin()
    }
  }
})

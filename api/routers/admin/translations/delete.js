const Route = require('lib/router/route')

const { Translation } = require('models')

module.exports = new Route({
  method: 'delete',
  path: '/:uuid',
  handler: async function (ctx) {
    const { uuid } = ctx.params
    let translation = await Translation.findOne({ 'uuid': uuid })
    ctx.assert(translation, 404, 'Translation not found')

    translation.set({ isDeleted: true })
    translation.save()

    ctx.body = {
      data: translation.toAdmin()
    }
  }
})

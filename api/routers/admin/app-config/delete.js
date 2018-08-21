const Route = require('lib/router/route')

const {AppConfig} = require('models')

module.exports = new Route({
  method: 'delete',
  path: '/:key',
  handler: async function (ctx) {
    var key = ctx.params.key

    var config = await AppConfig.findOne({key})
    ctx.assert(config, 404, 'Group not found')

    await config.remove()

    ctx.body = {
      success: true
    }
  }
})

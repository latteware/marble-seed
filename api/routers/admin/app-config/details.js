const Route = require('lib/router/route')

const {AppConfig} = require('models')

module.exports = new Route({
  method: 'get',
  path: '/:key',
  handler: async function (ctx) {
    var key = ctx.params.key

    const config = await AppConfig.findOne({key})
    ctx.assert(config, 404, 'Config not found')

    ctx.body = config.toAdmin()
  }
})

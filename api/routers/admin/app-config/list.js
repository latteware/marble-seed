const Route = require('lib/router/route')
const QueryParams = require('lib/router/query-params')

const {AppConfig} = require('models')

const queryParams = new QueryParams()

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    const filters = await queryParams.toFilters(ctx.request.query)

    var configs = await AppConfig.find(filters)

    ctx.body = configs.map(item => item.toAdmin())
  }
})

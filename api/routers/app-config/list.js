const Route = require('lib/router/route')
const {AppConfig} = require('models')
const QueryParams = require('lib/router/query-params')

const queryParams = new QueryParams()

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    const filters = await queryParams.toFilters(ctx.request.query)

    var data = await AppConfig.find(filters)

    const config = {}

    data.forEach(item => {
      config[item.key] = item.value
    })

    ctx.body = config
  }
})

const Route = require('lib/router/route')
const QueryParams = require('lib/router/query-params')
const { Translation } = require('models')
const queryParams = new QueryParams()

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    let modules = await Translation.find().distinct('modules')
    ctx.body = {
      data: modules
    }
  }
})

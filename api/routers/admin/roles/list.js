const Route = require('lib/router/route')
const { Role } = require('models')
const QueryParams = require('lib/router/query-params')

const queryParams = new QueryParams()

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    const filters = await queryParams.toFilters(ctx.request.query)

    var role = await Role.dataTables({
      limit: ctx.request.query.limit || 20,
      skip: ctx.request.query.start,
      find: { isDeleted: false, ...filters },
      sort: '-dateCreated',
      formatter: 'toAdmin'
    })

    ctx.body = role
  }
})

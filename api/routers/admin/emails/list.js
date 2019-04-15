const Route = require('lib/router/route')
const QueryParams = require('lib/router/query-params')
const { Email } = require('models')
const queryParams = new QueryParams()

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    const filters = await queryParams.toFilters(ctx.request.query)

    var emails = await Email.dataTables({
      limit: ctx.request.query.limit || 20,
      skip: ctx.request.query.start,
      find: { isDeleted: false, ...filters },
      sort: ctx.request.query.sort || '-dateCreated',
      formatter: 'toAdmin'
    })

    ctx.body = emails
  }
})

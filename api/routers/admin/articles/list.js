const Route = require('lib/router/route')
const { Article } = require('models')
const QueryParams = require('lib/router/query-params')
const queryParams = new QueryParams()

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    const filters = await queryParams.toFilters(ctx.request.query)

    const articles = await Article.dataTables({
      limit: ctx.request.query.limit || 20,
      skip: ctx.request.query.start,
      find: {
        ...filters,
        isDeleted: false
      },
      sort: ctx.request.query.sort || '-createdAt',
      formatter: 'toAdmin'
    })

    ctx.body = articles
  }
})

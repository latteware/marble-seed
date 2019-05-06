const Route = require('lib/router/route')
const QueryParams = require('lib/router/query-params')
const { Translation } = require('models')
const queryParams = new QueryParams()

module.exports = new Route({
  method: 'get',
  path: '/:lang/:modules',
  handler: async function (ctx) {
    const { lang, modules } = ctx.params
    const filters = await queryParams.toFilters(ctx.request.query)

    const translations = await Translation.dataTables({
      limit: ctx.request.query.limit || 20,
      skip: ctx.request.query.start,
      find: { isDeleted: false, ...filters, lang, modules },
      sort: ctx.request.query.sort || '-dateCreated',
      formatter: 'toAdmin'
    })

    ctx.body = translations
  }
})

const Route = require('lib/router/route')
const {RequestLog} = require('models')
const QueryParams = require('lib/router/query-params')

const queryParams = new QueryParams()
queryParams.addFilter('pathname', async function (filters, value) {
  if (value) {
    filters.pathname = value
  }
})

queryParams.addFilter('type', async function (filters, value) {
  if (value) {
    filters.type = value
  }
})

queryParams.addFilter('status', async function (filters, value) {
  if (value === 'success') {
    filters.status = {
      $gte: 200,
      $lt: 300
    }
  } else if (value === 'warning') {
    filters.status = {
      $gte: 400,
      $lt: 500
    }
  } else if (value === 'error') {
    filters.status = {
      $gte: 500
    }
  }
})

queryParams.addFilter('uuid', async function (filters, value, ctx) {
  if (!value) { return }

  const requestLog = await RequestLog.findOne({
    uuid: value
  })

  if (requestLog) {
    filters.$or = [
      {_id: requestLog._id},
      {replayFrom: requestLog._id}
    ]
  } else {
    ctx.throw(404, 'Request log not found')
  }
})

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    const filters = await queryParams.toFilters(ctx.request.query, ctx)

    const requestLogs = await RequestLog.dataTables({
      limit: ctx.request.query.limit || 20,
      skip: ctx.request.query.start,
      find: {isDeleted: {$ne: true}, ...filters},
      sort: ctx.request.query.sort || '-createdAt'
    })

    ctx.body = requestLogs
  }
})

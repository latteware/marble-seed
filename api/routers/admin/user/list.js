const Route = require('lib/router/route')
const QueryParams = require('lib/router/query-params')

const { User, Organization, Role, Group } = require('models')

const queryParams = new QueryParams()
queryParams.addFilter('group', async function (filters, value) {
  const group = await Group.findOne({ 'uuid': value })

  if (group) {
    filters.groups = { $in: [group._id] }
  }
})

queryParams.addFilter('role', async function (filters, value) {
  const role = await Role.findOne({ 'uuid': value })

  if (role) {
    filters.role = role._id
  }
})

queryParams.addFilter('organization', async function (filters, value) {
  const organization = await Organization.findOne({ 'uuid': value })

  if (organization) {
    filters.organizations = { $in: [organization._id] }
  }
})

queryParams.addFilter('isDeleted', async function (filters, value) {
  if (value === 'true') {
    filters.isDeleted = true
  } else {
    filters.isDeleted = { $ne: true }
  }
})

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    const filters = await queryParams.toFilters(ctx.request.query)

    const users = await User.dataTables({
      limit: ctx.request.query.limit || 20,
      skip: ctx.request.query.start,
      find: { isDeleted: { $ne: true }, ...filters },
      sort: ctx.request.query.sort || '-email',
      formatter: 'toAdmin'
    })

    ctx.body = users
  }
})

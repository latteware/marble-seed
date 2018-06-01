const Route = require('lib/router/route')
const { {{ name | capitalize }} } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    var {{ name | pluralize | lower }} = await {{ name | capitalize }}.dataTables({
      limit: ctx.request.query.limit || 20,
      skip: ctx.request.query.start,
      find: {isDeleted: false},
      sort: ctx.request.query.sort || '-dateCreated'
    })

    ctx.body = {{ name | pluralize | lower }}
  }
})

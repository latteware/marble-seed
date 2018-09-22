const Route = require('lib/router/route')

const {Organization} = require('models')

module.exports = new Route({
  method: 'delete',
  path: '/:uuid',
  handler: async function (ctx) {
    const organizationId = ctx.params.uuid

    const org = await Organization.findOne({'uuid': organizationId})
    ctx.assert(org, 404, 'Organization not found')

    org.set({isDeleted: true})
    org.save()

    ctx.body = {
      data: org.toAdmin()
    }
  }
})

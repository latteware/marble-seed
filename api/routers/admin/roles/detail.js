const Route = require('lib/router/route')

const { Role } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/:uuid',
  handler: async function (ctx) {
    var roleId = ctx.params.uuid

    const role = await Role.findOne({ 'uuid': roleId })
    ctx.assert(role, 404, 'Role not found')

    ctx.body = {
      data: role.toAdmin()
    }
  }
})

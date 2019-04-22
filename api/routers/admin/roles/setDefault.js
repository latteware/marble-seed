const Route = require('lib/router/route')

const { Role } = require('models')

module.exports = new Route({
  method: 'post',
  path: '/:uuid/setDefault',
  handler: async function (ctx) {
    var roleId = ctx.params.uuid

    const role = await Role.findOne({ 'uuid': roleId })
    ctx.assert(role, 404, 'Role not found')

    const defaultRole = await Role.findOne({ isDefault: true })

    if (defaultRole) {
      defaultRole.set({ isDefault: false })
      defaultRole.save()
    }

    role.set({ isDefault: true })
    role.save()

    ctx.body = {
      data: role.toAdmin()
    }
  }
})

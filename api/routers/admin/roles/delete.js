const Route = require('lib/router/route')

const { Role, User } = require('models')

module.exports = new Route({
  method: 'delete',
  path: '/:uuid',
  handler: async function (ctx) {
    var roleId = ctx.params.uuid

    var role = await Role.findOne({ 'uuid': roleId }).populate('users')
    ctx.assert(role, 404, 'Role not found')

    if (!role.isDefault) {
      var defaultRole = await Role.findOne({ isDefault: true })
      var users = await User.find({ role: role._id })

      for (var user of users) {
        user.set({ role: defaultRole._id })
        await user.save()
      }

      role.set({
        isDeleted: true,
        users: []
      })

      await role.save()
    }

    ctx.body = {
      data: role.toAdmin()
    }
  }
})

const Route = require('lib/router/route')
const lov = require('lov')

const { User, Role } = require('models')

module.exports = new Route({
  method: 'post',
  path: '/:uuid',
  validator: lov.object().keys({
    name: lov.string().required(),
    email: lov.string().email().required()
  }),
  handler: async function (ctx) {
    var userId = ctx.params.uuid
    var data = ctx.request.body

    const user = await User.findOne({ 'uuid': userId, 'isDeleted': { $ne: true } })
    ctx.assert(user, 404, 'User not found')

    if (data.role) {
      const role = await Role.findOne({ uuid: data.role })
      ctx.assert(role, 404, 'Role not found')

      user.role = role
    } else {
      user.role = undefined
    }

    delete data.role
    user.set(data)
    await user.save()

    ctx.body = {
      data: user.toAdmin()
    }
  }
})

const Route = require('lib/router/route')

const { User } = require('models')

module.exports = new Route({
  method: 'delete',
  path: '/:uuid',
  handler: async function (ctx) {
    var userId = ctx.params.uuid

    var user = await User.findOne({ 'uuid': userId, 'isDeleted': { $ne: true } })
    ctx.assert(user, 404, 'User not found')

    user.set({
      isDeleted: true
    })

    await user.save()

    ctx.body = {
      data: user.toAdmin()
    }
  }
})

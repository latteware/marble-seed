const Route = require('lib/router/route')
const { User } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/:uuid',
  handler: async function (ctx) {
    const userId = ctx.params.uuid

    const user = await User.findOne({ 'uuid': userId, 'isDeleted': { $ne: true } })
      .populate('organizations')
      .populate('groups')
      .populate('role')

    ctx.assert(user, 404, 'User not found')

    ctx.body = {
      data: user.toAdmin()
    }
  }
})

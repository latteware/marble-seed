const Route = require('lib/router/route')
const { Group, User } = require('models')

module.exports = new Route({
  method: 'post',
  path: '/:uuid/remove/group',
  handler: async function (ctx) {
    const userId = ctx.params.uuid

    const user = await User.findOne({ 'uuid': userId })
    ctx.assert(user, 404, 'User not found')

    const group = await Group.findOne({ 'uuid': ctx.request.body.group })
    ctx.assert(group, 404, 'Group not found')

    var pos = user.groups.indexOf(group._id)
    user.groups.splice(pos, 1)
    user.save()

    pos = group.users.indexOf(user._id)
    group.users.splice(pos, 1)
    group.save()

    ctx.body = {
      data: user.toAdmin()
    }
  }
})

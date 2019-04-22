const Route = require('lib/router/route')
const { Group, User } = require('models')

module.exports = new Route({
  method: 'post',
  path: '/:uuid/add/group',
  handler: async function (ctx) {
    const userId = ctx.params.uuid

    const user = await User.findOne({ 'uuid': userId, 'isDeleted': false }).populate('groups')
    ctx.assert(user, 404, 'User not found')

    const group = await Group.findOne({ 'uuid': ctx.request.body.group })
    ctx.assert(group, 404, 'Group not found')

    if (user.groups.find(item => { return String(item) === String(group._id) })) {
      ctx.throw(400, 'You can only add the user to a group once!')
    }

    user.groups.push(group)
    await user.save()

    group.users.push(user)
    await group.save()

    ctx.body = {
      data: user.toAdmin()
    }
  }
})

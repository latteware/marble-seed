const Route = require('lib/router/route')

const { Group } = require('models')

module.exports = new Route({
  method: 'delete',
  path: '/:uuid',
  handler: async function (ctx) {
    var groupId = ctx.params.uuid

    var group = await Group.findOne({ 'uuid': groupId }).populate('users')
    ctx.assert(group, 404, 'Group not found')

    group.set({ isDeleted: true })

    for (var user of group.users) {
      var pos = user.groups.indexOf(group._id)
      user.groups.splice(pos, 1)
      user.save()
    }

    group.set({ users: [] })

    group.save()

    ctx.body = {
      data: group.toAdmin()
    }
  }
})

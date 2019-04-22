const Route = require('lib/router/route')

const { Group } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/:uuid',
  handler: async function (ctx) {
    var groupId = ctx.params.uuid

    const group = await Group.findOne({ 'uuid': groupId })
    ctx.assert(group, 404, 'Group not found')

    ctx.body = {
      data: group.toAdmin()
    }
  }
})

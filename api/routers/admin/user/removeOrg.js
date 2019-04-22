const Route = require('lib/router/route')
const { Organization, User } = require('models')

module.exports = new Route({
  method: 'post',
  path: '/:uuid/remove/organization',
  handler: async function (ctx) {
    const userId = ctx.params.uuid

    const user = await User.findOne({ 'uuid': userId })
    ctx.assert(user, 404, 'User not found')

    const org = await Organization.findOne({ 'uuid': ctx.request.body.organization })
    ctx.assert(org, 404, 'Organization not found')

    var pos = user.organizations.indexOf(org._id)
    user.organizations.splice(pos, 1)
    user.save()

    pos = org.users.indexOf(user._id)
    org.users.splice(pos, 1)
    org.save()

    ctx.body = {
      data: user.toAdmin()
    }
  }
})

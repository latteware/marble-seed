const Route = require('lib/router/route')
const { Organization, User } = require('models')

module.exports = new Route({
  method: 'post',
  path: '/:uuid/add/organization',
  handler: async function (ctx) {
    const userId = ctx.params.uuid

    const user = await User.findOne({ 'uuid': userId, 'isDeleted': false }).populate('organizations')
    ctx.assert(user, 404, 'User not found')

    const org = await Organization.findOne({ 'uuid': ctx.request.body.organization })
    ctx.assert(org, 404, 'Organization not found')

    if (user.organizations.find(item => { return String(item) === String(org._id) })) {
      ctx.throw(400, 'You can only add the user to an organization once!')
    }

    user.organizations.push(org)
    await user.save()

    org.users.push(user)
    await org.save()

    ctx.body = {
      data: user.toAdmin()
    }
  }
})

const Route = require('lib/router/route')

const { Organization, User, Role, Group } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    const orgsCount = await Organization.find({ 'isDeleted': false }).count()
    const usersCount = await User.count()
    const rolesCount = await Role.find({ 'isDeleted': false }).count()
    const groupsCount = await Group.find({ 'isDeleted': false }).count()

    ctx.body = {
      orgsCount: orgsCount,
      usersCount: usersCount,
      rolesCount: rolesCount,
      groupsCount: groupsCount
    }
  }
})

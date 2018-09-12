const Route = require('lib/router/route')

const {User} = require('models')

module.exports = new Route({
  method: 'post',
  path: '/reset-password',
  handler: async function (ctx) {
    var userId = ctx.request.body.email
    var fromAdmin = ctx.request.body.admin

    const user = await User.findOne({'email': userId})
    ctx.assert(user, 404, 'User not found!')

    if (fromAdmin && !user.isAdmin) {
      ctx.throw(403, 'You are not an admin!')
    }

    user.sendResetPasswordEmail(fromAdmin)

    ctx.body = {
      data: 'OK'
    }
  }
})

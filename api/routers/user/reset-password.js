const Route = require('lib/router/route')
const { User } = require('models')
const lov = require('lov')

module.exports = new Route({
  method: 'post',
  path: '/reset-password',
  validator: lov.object().keys({
    email: lov.string().email().required()
  }),
  handler: async function (ctx) {
    var userId = ctx.request.body.email
    var fromAdmin = ctx.request.body.admin

    const user = await User.findOne({ 'email': userId })
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

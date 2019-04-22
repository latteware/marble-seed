const Route = require('lib/router/route')
const lov = require('lov')

const { User } = require('models')

module.exports = new Route({
  method: 'post',
  path: '/invite/validate',
  validator: lov.object().keys({
    token: lov.string().required(),
    email: lov.string().email().required()
  }),
  handler: async function (ctx) {
    const { email, token } = ctx.request.body
    const user = await User.validateInvite(email, token)

    ctx.body = {
      user: user.toPublic()
    }
  }
})

const Route = require('lib/router/route')
const {UserToken} = require('models')
const lov = require('lov')

module.exports = new Route({
  method: 'post',
  path: '/set-password',
  validator: lov.object().keys({
    uuid: lov.string().required(),
    password: lov.string().required()
  }),
  handler: async function (ctx) {
    const { uuid, password } = ctx.request.body

    const token = await UserToken.findOne({uuid: uuid}).populate('user')
    if (!token) {
      return ctx.throw(401, 'Invalid token')
    }

    const user = token.user
    if (user.isDeleted) {
      return ctx.throw(401, 'User has been suspended')
    }

    user.set({password})
    user.save()

    const sessionToken = await user.createToken({
      type: 'session'
    })

    ctx.body = {
      user: user.toPublic(),
      isAdmin: user.isAdmin,
      jwt: sessionToken.getJwt()
    }
  }
})

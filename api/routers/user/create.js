const Route = require('lib/router/route')
const lov = require('lov')

const {User, Role} = require('models')

module.exports = new Route({
  method: 'post',
  path: '/',
  validator: lov.object().keys({
    name: lov.string(),
    email: lov.string().email().required(),
    password: lov.string().required(),
    screenName: lov.string().required()
  }),
  handler: async function (ctx) {
    let user

    const { screenName, name, email, password } = ctx.request.body

    try {
      user = await User.register({
        screenName,
        name,
        email,
        password
      })
    } catch (e) {
      return ctx.throw(422, e.message)
    }

    let defaultRole = await Role.findOne({isDefault: true})

    user.role = defaultRole
    user.save()

    const token = await user.createToken({
      type: 'session'
    })

    ctx.body = {
      user: user.toPublic(),
      jwt: token.getJwt()
    }
  }
})

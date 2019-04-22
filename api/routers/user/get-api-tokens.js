const Route = require('lib/router/route')

const { UserToken } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/tokens',
  handler: async function (ctx) {
    const { user } = ctx.state

    if (!user) {
      return ctx.throw(403)
    }

    if (ctx.state.authMethod !== 'Bearer') {
      return ctx.throw(403)
    }

    const tokens = await UserToken.find({
      isDeleted: { $ne: true },
      user: user._id,
      type: 'api'
    })

    ctx.body = {
      tokens: tokens.map(token => token.toPublic())
    }
  }
})

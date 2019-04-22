const Route = require('lib/router/route')
const { UserToken } = require('models')

module.exports = new Route({
  method: 'del',
  path: '/tokens/:uuid',
  handler: async function (ctx) {
    const tokenUUId = ctx.params.uuid
    const currentToken = ctx.state.token
    const { user } = ctx.state

    if (!user) {
      return ctx.throw(403)
    }

    if (!currentToken) {
      return ctx.throw(401)
    }

    if (ctx.state.authMethod === 'Basic' && currentToken.uuid !== tokenUUId) {
      return ctx.throw(403)
    }

    const token = await UserToken.findOne({ 'uuid': tokenUUId })
    ctx.assert(token, 404, 'Token not found')

    token.isDeleted = true
    await token.save()

    ctx.body = { success: true }
  }
})

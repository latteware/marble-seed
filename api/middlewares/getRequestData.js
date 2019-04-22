const { UserToken } = require('models')
const { server } = require('config')
const jwt = require('lib/jwt')

module.exports = async function (ctx, next) {
  let userToken

  if (ctx.req.headers.authorization) {
    const [ method, token ] = ctx.req.headers.authorization.split(' ')

    if (method === 'Bearer') {
      var data
      try {
        data = await jwt.verify(token)
      } catch (e) {
        ctx.throw(401, 'Invalid JWT')
      }

      userToken = await UserToken.findOne({
        key: data.key,
        secret: data.secret,
        isDeleted: { $ne: true }
      }).populate('user')

      if (!userToken) {
        return ctx.throw(401, 'Invalid User')
      }

      if (!userToken.user) {
        return ctx.throw(401, 'Invalid User')
      }

      if (userToken.user.isDeleted) {
        return ctx.throw(401, 'Invalid User')
      }

      ctx.state.authMethod = 'Bearer'
    }

    if (method === 'Basic') {
      const decodedStr = Buffer.from(token, 'base64').toString('ascii')

      const key = decodedStr.split(':')[0]
      const secret = decodedStr.split(':')[1]

      userToken = await UserToken.findOne({
        key: key,
        secret: secret,
        isDeleted: { $ne: true }
      }).populate('user')

      if (!userToken) {
        return ctx.throw(401, 'Invalid User')
      }

      if (!userToken.user) {
        return ctx.throw(401, 'Invalid User')
      }

      if (userToken.user.isDeleted) {
        return ctx.throw(401, 'Invalid User')
      }

      ctx.state.authMethod = 'Basic'
    }
  }

  ctx.state.appHost = server.appHost
  ctx.state.apiHost = server.apiHost

  if (userToken) {
    ctx.state.user = userToken.user
    ctx.state.token = userToken

    userToken.lastUse = new Date()
    await userToken.save()
  }

  await next()
}

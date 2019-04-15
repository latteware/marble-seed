const Route = require('lib/router/route')
const { Email } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/:uuid',
  handler: async function (ctx) {
    let { uuid } = ctx.params

    const email = await Email.findOne({ 'uuid': uuid })
    ctx.assert(email, 404, 'Email not found')

    ctx.body = {
      data: email.toAdmin()
    }
  }
})

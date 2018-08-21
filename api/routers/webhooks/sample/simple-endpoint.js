const Route = require('lib/router/route')

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    ctx.body = {
      success: true,
      requested: new Date()
    }
  }
})

const Route = require('lib/router/route')

const {RequestLog} = require('models')

module.exports = new Route({
  method: 'get',
  path: '/metadata',
  priority: 11,
  handler: async function (ctx) {
    const pathnames = await RequestLog.distinct('pathname')
    const methods = await RequestLog.distinct('method')

    ctx.body = {
      pathnames,
      methods
    }
  }
})

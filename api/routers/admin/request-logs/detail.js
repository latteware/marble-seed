const Route = require('lib/router/route')

const { RequestLog } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/:uuid',
  handler: async function (ctx) {
    var requestId = ctx.params.uuid

    const request = await RequestLog.findOne({ 'uuid': requestId }).populate('replayFrom')
    ctx.assert(request, 404, 'RequestLog not found')

    ctx.body = {
      data: request
    }
  }
})

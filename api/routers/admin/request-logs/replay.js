const Route = require('lib/router/route')

const {RequestLog} = require('models')

module.exports = new Route({
  method: 'post',
  path: '/:uuid/replay',
  handler: async function (ctx) {
    var requestId = ctx.params.uuid

    const request = await RequestLog.findOne({'uuid': requestId})
    ctx.assert(request, 404, 'RequestLog not found')

    await request.replay()

    const requestLog = await RequestLog.findOne({
      replayFrom: request._id
    }).sort('-createdAt')

    ctx.body = {
      requestLog
    }
  }
})

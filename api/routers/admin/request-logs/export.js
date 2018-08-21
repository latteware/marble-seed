const Route = require('lib/router/route')
const _ = require('lodash')

const {RequestLog} = require('models')

module.exports = new Route({
  method: 'get',
  path: '/export/:uuid',
  priority: 10,
  handler: async function (ctx) {
    var requestId = ctx.params.uuid

    const request = await RequestLog.findOne({'uuid': requestId})
    ctx.assert(request, 404, 'RequestLog not found')

    var headerKeys = _.keys(request.headers)
    var headers = []

    for (var key of headerKeys) {
      headers.push({
        key: key,
        value: request.headers[key]
      })
    }

    let url = request.host + request.path

    if (request.method === 'GET' && request.query) {
      url = `${url}?${request.query}`
    }

    var collection = {
      info: {
        name: `Collection ${request.path}`,
        schema: 'https://schema.getpostman.com/json/collection/v2.0.0/'
      },
      item: [
        {
          name: request.host + request.path,
          request: {
            url: url,
            method: request.method,
            header: headers,
            body: request.body
          }
        }
      ]
    }

    collection = JSON.stringify(collection, null, '  ')

    ctx.body = collection
  }
})

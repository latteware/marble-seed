const { RequestLog } = require('models')
const req = require('request-promise-native')
var qs = require('qs')
const { URL } = require('url')

async function request (options) {
  options.headers = options.headers || {}
  if (options.json) {
    options.headers['content-type'] = 'application/json'
  }

  var headers = {}
  var query = ''
  var host = ''
  var path = ''
  var reqBody = {}
  var ip = ''
  var method = 'GET'

  if (!options.uri && !options.url) {
    throw new Error('URI | URL is a required argument!')
  }

  headers = options.headers || {}
  method = options.method || 'GET'
  var urlAux = options.url || options.uri

  if (typeof urlAux === 'string' && !options.baseUrl) {
    urlAux = new URL(urlAux)
  } else if (typeof urlAux === 'string' && options.baseUrl) {
    urlAux = new URL(`${urlAux}${options.baseUrl}`)
  }

  host = urlAux.origin
  path = urlAux.pathname

  if (options.qs && typeof options.qs === 'string') {
    query = options.qs
  } else if (options.qs && typeof options.qs === 'object') {
    query = qs.stringify(options.qs)
  }

  if (options.body) {
    if (options.json) {
      reqBody = options.body
    } else {
      reqBody = {content: options.body}
    }
  }

  const reqData = {
    headers,
    query,
    host,
    path,
    pathname: options.pathname,
    body: reqBody,
    type: 'outbound',
    status: 200,
    response: undefined,
    ip,
    method
  }

  if (options.headers && options.headers.replayFrom) {
    const replayFrom = await RequestLog.findOne({'uuid': options.headers.replayFrom})
    if (replayFrom) { reqData.replayFrom = replayFrom._id }
  }

  try {
    var response = await req(options)
    reqData.response = response

    if (options.persist) {
      reqData.response = response
      await RequestLog.create(reqData)
    }

    return response
  } catch (e) {
    reqData.status = e.statusCode || 500
    reqData.error = {
      message: e.message,
      stack: e.stack
    }

    if (options.persist) {
      await RequestLog.create(reqData)
    }

    throw e
  }
}

const fn = request

fn.get = async function (url, query, persist = true) {
  return request({url, query, persist, method: 'GET'})
}
fn.post = async function (url, data, persist = true) {
  return request({url, body: data, persist, method: 'POST'})
}
fn.put = async function (url, data, persist = true) {
  return request({url, query: data, persist, method: 'PUT'})
}
fn.update = async function (url, data, persist = true) {
  return request({url, query: data, persist, method: 'UPDATE'})
}
fn.delete = async function (url, persist = true) {
  return request({url, persist, method: 'DELETE'})
}

module.exports = fn

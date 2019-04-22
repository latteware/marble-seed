const config = require('config')
const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const dataTables = require('mongoose-datatables')

const requestLogSchema = new Schema({
  headers: { type: Object },
  query: { type: String },
  host: { type: String },
  path: { type: String },
  pathname: { type: String },
  type: { type: String },
  body: { type: Object },
  response: { type: Object },
  ip: { type: String },
  method: { type: String },
  status: { type: Number },
  replayFrom: { type: Schema.Types.ObjectId, ref: 'RequestLog' },
  uuid: { type: String, default: v4 },
  error: {
    message: { type: String },
    stack: { type: String }
  }
}, {
  timestamps: true,
  usePushEach: true
})

requestLogSchema.methods.replay = async function () {
  const request = require('lib/request')
  const RequestLog = mongoose.model('RequestLog')
  const replayFrom = this

  replayFrom.headers = replayFrom.headers || {}
  replayFrom.headers.replayFrom = replayFrom.uuid

  // Remove content lenght so its calculated again
  delete replayFrom.headers['content-length']

  var options = {
    method: replayFrom.method,
    headers: replayFrom.headers,
    body: replayFrom.body,
    pathname: replayFrom.pathname
  }

  if (replayFrom.type === 'inbound') {
    options.url = config.server.apiHost + replayFrom.path
  }

  if (replayFrom.type === 'outbound') {
    options.url = replayFrom.host + replayFrom.path
    options.persist = true
  }

  if (options.headers['content-type'] && options.headers['content-type'] === 'application/json') {
    options.json = true
  }

  const res = await request(options)

  let requestLog
  if (replayFrom.type === 'inbound') {
    requestLog = await RequestLog.findOne({
      replayFrom: replayFrom._id
    }).sort('-createdAt')
  }

  if (replayFrom.type === 'outbound') {
    requestLog = res.requestLog
  }

  return requestLog
}

requestLogSchema.index({ createdAt: 1, uuid: 1, status: 1 })

requestLogSchema.plugin(dataTables)

module.exports = mongoose.model('RequestLog', requestLogSchema)

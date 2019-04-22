// node tasks/sendRequest.js --uuid uuid
// uuid RequestLog
require('../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const { RequestLog } = require('models')

const task = new Task(async function (argv) {
  const requestLog = await RequestLog.findOne({ 'uuid': argv.uuid })
  if (!requestLog) {
    console.log('Error: RequestLog not found')
    return false
  }

  const replayLog = await requestLog.replay()

  return replayLog.uuid
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}

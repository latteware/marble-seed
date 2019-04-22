// node tasks/scaffolding/admin/scaffold-admin
require('../../../config')
require('lib/databases/mongo')
const commands = require('./commands')
const createModel = require('../create-model')

const Task = require('lib/task')

const task = new Task(async function (argv) {
  const model = await createModel.run()

  for (const api in commands.admin.api) {
    var commandApi = require('./' + commands.admin.api[api].file)
    await commandApi.run({ model })
  }

  for (const frontend in commands.admin.frontend) {
    var commandFront = require('./' + commands.admin.frontend[frontend].file)
    await commandFront.run({ model })
  }

  return true
}, 500)

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}

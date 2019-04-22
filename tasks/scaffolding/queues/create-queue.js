// node tasks/scaffolding/queues/create-queue
require('../../../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const scaffolding = require('lib/scaffolding')
const path = require('path')
const s = require('underscore.string')

const task = new Task(async function (argv) {
  const INITPROMPT = [
    {
      name: 'cronName',
      type: 'input',
      message: 'Whats is the name of the queue?'
    }
  ]
  const answers = await scaffolding.prompt(INITPROMPT)
  var queue = answers.cronName.toLowerCase()

  const templatePath = path.join('./tasks/scaffolding/templates/queues/queue.js')
  const dirPath = path.join('./queues/')
  const filePath = path.join('./queues/' + queue + '.js')
  const fileQueue = await scaffolding.createFileFromTemplate(dirPath, filePath, templatePath, { queue: queue })

  const cronIndexPath = path.join('./queues/index.js')

  scaffolding.replaceInFile(cronIndexPath, '// #Exports', ',\n  \'' + s.capitalize(queue) + '\': ' + s.capitalize(queue) + '// #Exports')
  scaffolding.replaceInFile(cronIndexPath, '// #Requires', 'const ' + s.capitalize(queue) + ' = require(\'./' + queue + '\')\n// #Requires')

  return true
}, 500)

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}

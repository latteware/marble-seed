// node tasks/scaffolding/tasks/create-task
require('../../../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const scaffolding = require('lib/scaffolding')
const path = require('path')

const task = new Task(async function (argv) {
  const INITPROMPT = [
    {
      name: 'taskName',
      type: 'input',
      message: 'Whats is the name of the task?'
    }
  ]
  const answers = await scaffolding.prompt(INITPROMPT)
  var task = answers.taskName.toLowerCase()

  const templatePath = path.join('./tasks/scaffolding/templates/tasks/task.js')
  const dirPath = path.join('./tasks/')
  const filePath = path.join('./tasks/' + task + '.js')
  const fileTask = await scaffolding.createFileFromTemplate(dirPath, filePath, templatePath, { task: task })

  return true
}, 500)

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}

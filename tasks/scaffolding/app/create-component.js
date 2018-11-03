// node tasks/scaffolding/admin-frontend-detail --model foo
require('../../../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const scaffolding = require('lib/scaffolding')
const path = require('path')
const s = require('underscore.string')

const componentTemplate = './tasks/scaffolding/templates/app/frontend/component.js'

const task = new Task(async function (argv) {
  const QUESTIONS = [
    {
      name: 'name',
      type: 'input',
      message: 'Whats is the name of the component?'
    }
  ]

  const answers = await scaffolding.prompt(QUESTIONS)

  const templateData = {
    name: answers.name,
    className: s.classify(answers.name),
    slug: s.slugify(answers.componentName)
  }

  const templatePath = path.join(componentTemplate)
  const dirPath = path.join('./app/frontend/components/')
  const filePath = path.join(dirPath, `${templateData.slug}.js`)
  await scaffolding.createFileFromTemplate(dirPath, filePath, templatePath, templateData)

  return true
}, 500)

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}

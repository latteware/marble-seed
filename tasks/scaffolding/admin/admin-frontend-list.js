// node tasks/scaffolding/admin-frontend-list --model foo
require('../../../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const scaffolding = require('lib/scaffolding')
const path = require('path')
const s = require('underscore.string')
const pluralize = require('pluralize')

const task = new Task(async function (argv) {
  if (!argv.model) {
    throw new Error('Model name is required')
  }

  const model = scaffolding.getModel(argv.model)
  if (!model) {
    throw new Error('Model ' + argv.model + ' doesn\'t exits')
  }
  const QUESTIONS = [
    {
      name: 'properties',
      type: 'checkbox',
      message: 'Select properties to use in list:',
      choices: scaffolding.getModelProperties(model)
    }
  ]

  const answers = await scaffolding.prompt(QUESTIONS)

  const properties = answers.properties

  const modelSchema = scaffolding.getModelSchemaForTemplate(model, properties)

  const templatePath = path.join('./tasks/scaffolding/templates/admin/frontend/pages/pages-admin/list.js')
  const dirPath = path.join('./admin/frontend/pages/' + pluralize(modelSchema.name) + '/')
  const filePath = dirPath + 'list.js'
  const fileList = await scaffolding.createFileFromTemplate(dirPath, filePath, templatePath, modelSchema)

  const routerPath = path.join('./admin/frontend/router.js')

  scaffolding.replaceInFile(routerPath, '// #Import', 'import ' + s.capitalize(pluralize(modelSchema.name)) + ' from \'./pages/' + pluralize(modelSchema.name) + '/list\'\n// #Import')
  scaffolding.replaceInFile(routerPath, '<div id=\'route\' />', '{' + s.capitalize(pluralize(modelSchema.name)) + '.asRouterItem()}\n          <div id=\'route\' />')

  return true
}, 500)

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}

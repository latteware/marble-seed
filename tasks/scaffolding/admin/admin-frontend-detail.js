// node tasks/scaffolding/admin-frontend-detail --model foo
require('../../../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const scaffolding = require('lib/scaffolding')
const path = require('path')
const s = require('underscore.string')

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
      message: 'Select properties to use in detail:',
      choices: scaffolding.getModelProperties(model)
    }
  ]

  const answers = await scaffolding.prompt(QUESTIONS)

  const properties = answers.properties

  const modelSchema = scaffolding.getModelSchemaForTemplate(model, properties)

  const templatePath = path.join('./tasks/scaffolding/templates/admin/frontend/pages/pages-admin/detail.js')
  const dirPath = path.join('./admin/frontend/pages/' + modelSchema.name + 's/')
  const filePath = dirPath + 'detail.js'
  await scaffolding.createFileFromTemplate(dirPath, filePath, templatePath, modelSchema)

  const routerPath = path.join('./admin/frontend/router.js')

  scaffolding.replaceInFile(routerPath, '// #Import', 'import ' + s.capitalize(modelSchema.name) + 'Detail from \'./pages/' + modelSchema.name + 's/detail\'\n// #Import')
  scaffolding.replaceInFile(routerPath, /{\/\* Add routes here \*\/}/, `{${s.capitalize(modelSchema.name)}Detail.asRouterItem()}\n          {/* Add routes here */}`)

  return true
}, 500)

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}

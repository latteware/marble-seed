// node tasks/scaffolding/admin-frontend-create --model foo
require('../../../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const scaffolding = require('lib/scaffolding')
const path = require('path')
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

  const templatePath = path.join('./tasks/scaffolding/templates/admin/frontend/pages/pages-admin/create.js')
  const dirPath = path.join('./admin/frontend/pages/' + pluralize(modelSchema.name) + '/')
  const filePath = dirPath + 'create.js'
  const fileApi = await scaffolding.createFileFromTemplate(dirPath, filePath, templatePath, modelSchema)

  const templatePath2 = path.join('./tasks/scaffolding/templates/admin/frontend/pages/pages-admin/create-form.js')
  const dirPath2 = path.join('./admin/frontend/pages/' + pluralize(modelSchema.name) + '/')
  const filePath2 = dirPath + 'create-form.js'
  const fileApi2 = await scaffolding.createFileFromTemplate(dirPath2, filePath2, templatePath2, modelSchema)

  return true
}, 500)

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}

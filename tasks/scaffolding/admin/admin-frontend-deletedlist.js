// node tasks/scaffolding/admin-frontend-deletedlist --model foo
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
      message: 'Select properties to use in deleted list:',
      choices: scaffolding.getModelProperties(model)
    }
  ]

  const answers = await scaffolding.prompt(QUESTIONS)

  const properties = answers.properties

  const modelSchema = scaffolding.getModelSchemaForTemplate(model, properties)

  const templatePath = path.join('./tasks/scaffolding/templates/admin/frontend/pages/pages-admin/deleted-list.js')
  const dirPath = path.join('./admin/frontend/pages/' + modelSchema.name + 's/')
  const filePath = dirPath + 'deleted-list.js'
  await scaffolding.createFileFromTemplate(dirPath, filePath, templatePath, modelSchema)

  const routerPath = path.join('./admin/frontend/router.js')
  scaffolding.replaceInFile(routerPath, '// #Import', 'import Deleted' + s.capitalize(modelSchema.name) + 's from \'./pages/' + modelSchema.name + 's/deleted-list\'\n// #Import')
  scaffolding.replaceInFile(routerPath, /{\/\* Add routes here \*\/}/, `{Deleted${s.capitalize(modelSchema.name)}s.asRouterItem()}\n          {/* Add routes here */}`)

  const sidebarPath = path.join('./admin/frontend/components/sidebar.js')
  scaffolding.replaceInFile(sidebarPath, '// #Import', 'import Deleted' + s.capitalize(modelSchema.name) + 's from \'../pages/' + modelSchema.name + 's/deleted-list\'\n// #Import')
  scaffolding.replaceInFile(sidebarPath, '// #Restore', ',\nDeleted' + s.capitalize(modelSchema.name) + 's.asSidebarItem()// #Restore')

  return true
}, 500)

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}

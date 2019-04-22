// node tasks/scaffolding/admin-frontend-detail --model foo
require('../../../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const scaffolding = require('lib/scaffolding')
const path = require('path')
const s = require('underscore.string')

const pageTemplate = './tasks/scaffolding/templates/app/frontend/page.js'

const task = new Task(async function (argv) {
  const QUESTIONS = [
    {
      name: 'name',
      type: 'input',
      message: 'Whats is the name of the page?'
    },
    {
      name: 'path',
      type: 'input',
      message: 'Whats is the path of the page?'
    }
  ]

  const answers = await scaffolding.prompt(QUESTIONS)

  const templateData = {
    name: answers.name,
    path: answers.path,
    title: s.capitalize(answers.name),
    slug: s.slugify(answers.name),
    fileName: `${s.slugify(answers.name)}.js`,
    importName: s.classify(answers.name),
    cssClassName: `${s.classify(answers.name)}`,
    reactClassName: `${s.classify(answers.name)}Page`
  }
  console.log('=>', answers, templateData)

  // create page file
  const templatePath = path.join(pageTemplate)
  const dirPath = path.join('./app/frontend/pages/')
  const filePath = path.join(dirPath, templateData.fileName)
  await scaffolding.createFileFromTemplate(dirPath, filePath, templatePath, templateData)

  // add it to the router
  const routerPath = path.join('./app/frontend/router.js')
  scaffolding.replaceInFile(routerPath, `// #Import`, `import ${templateData.importName} from './pages/${templateData.fileName}'\n// #Import`)
  scaffolding.replaceInFile(routerPath, /{\/\* Add routes here \*\/}/, `{${templateData.importName}.asRouterItem()}\n          {\/* Add routes here *\/}`)

  return true
}, 500)

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}

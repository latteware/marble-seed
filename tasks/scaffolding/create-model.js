// node tasks/scaffolding/create-model
require('../../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const scaffolding = require('lib/scaffolding')
const path = require('path')
const s = require('underscore.string')

const task = new Task(async function (argv) {
  const INITPROMPT = [
    {
      name: 'modelName',
      type: 'input',
      message: 'Whats is the name of the model?'
    },
    {
      name: 'totalFields',
      type: 'input',
      message: 'How many fields are in the model?'
    }
  ]
  const answers = await scaffolding.prompt(INITPROMPT)

  const total = answers.totalFields
  var model = {
    name: answers.modelName.toLowerCase(),
    fields: []
  }

  var QUESTIONFIELDS = []

  for (var i = 0; i < total; i++) {
    QUESTIONFIELDS.push(
      {
        name: 'fieldName' + i,
        type: 'input',
        message: 'Name of the field ' + (i + 1) + ':'
      },
      {
        name: 'fieldType' + i,
        type: 'list',
        message: 'Type of the field ' + (i + 1) + ':',
        choices: [
          'string',
          'number',
          'boolean',
          'date'
        ]
      },
      {
        name: 'fieldRequired' + i,
        type: 'confirm',
        message: 'the field ' + (i + 1) + ' is required?'
      },
      {
        name: 'fieldDefault' + i,
        type: 'input',
        message: 'Default value for field ' + (i + 1) + ' (leave blank if not):'
      },
      {
        name: 'fieldArray' + i,
        type: 'confirm',
        message: 'Field ' + (i + 1) + ' is Array of objects?:'
      })
  }

  const dataModel = await scaffolding.prompt(QUESTIONFIELDS)

  for (i = 0; i < total; i++) {
    model.fields.push({
      name: dataModel['fieldName' + i],
      type: dataModel['fieldType' + i],
      isRequired: dataModel['fieldRequired' + i],
      default: dataModel['fieldDefault' + i],
      isArray: dataModel['fieldArray' + i]
    })
  }

  const templatePath = path.join('./tasks/scaffolding/templates/model.js')
  const dirPath = path.join('./models/')
  const filePath = path.join('./models/' + model.name + '.js')
  await scaffolding.createFileFromTemplate(dirPath, filePath, templatePath, model)

  const modelIndexPath = path.join('./models/index.js')

  scaffolding.replaceInFile(modelIndexPath, '// #Exports', ',\n  ' + s.capitalize(model.name) + '// #Exports')
  scaffolding.replaceInFile(modelIndexPath, '// #Import', 'const ' + s.capitalize(model.name) + ' = require(\'./' + model.name + '\')\n// #Import')

  return model.name
}, 500)

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}

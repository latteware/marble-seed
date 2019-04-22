// node tasks/seed-data --file <file>
require('../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const Models = require('models')
const fs = require('fs')
const _ = require('lodash')

const task = new Task(async function (argv) {
  if (!argv.file) {
    throw new Error('A JSON file with the data is required!')
  }

  console.log('Starting ....')

  let data = {}

  try {
    console.log('Loading data from file ....')
    const saveFile = fs.readFileSync(
      argv.file,
      'utf8'
    )
    data = JSON.parse(saveFile)
  } catch (e) {
    console.log('=========================================================')
    console.log('Error when fetching data from Disk ' + e)
    console.log('=========================================================')

    return
  }

  let createdItems = 0
  let existingItems = 0
  let errors = 0

  const recipes = _.map(data, (items, modelName) => {
    return {
      items,
      modelName,
      model: Models[modelName]
    }
  }).filter(recipe => recipe.model && recipe.items.length)

  for (const recipe of recipes) {
    const model = recipe.model
    console.log('working with =>', recipe.modelName, recipe.items.length)

    for (const item of recipe.items) {
      try {
        let queryItem
        if (model.schema.statics.toCoreProperties) {
          queryItem = model.schema.statics.toCoreProperties(item)
        } else {
          queryItem = item
        }

        const existingItem = await model.findOne(queryItem)

        if (!existingItem) {
          const created = await recipe.model.create(item)
          console.log('Created', created.uuid, '=>', item)
          createdItems++
        } else {
          console.log('Existing', existingItem.uuid, '=>', item)
          existingItems++
        }
      } catch (e) {
        errors++
        console.error('Error =>', e.message, e.stack)
      }
    }
  }

  return { created: createdItems, existing: existingItems, errors }
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}

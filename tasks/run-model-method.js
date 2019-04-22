// node tasks/run-model-method --model MODEL_NAME --method METHOD_NAME --uuid UUID ..methodArgs
require('../config')
require('lib/databases/mongo')

const Task = require('lib/task')

const models = require('models')

const task = new Task(async function (argv) {
  if (!argv.uuid || !argv.model || !argv.method) {
    throw new Error('Argument model, method and uuid are required')
  }

  const model = models[argv.model]
  if (!model) {
    throw new Error(`Model ${argv.model} not found`)
  }

  const doc = await model.findOne({ uuid: argv.uuid })
  if (!doc) {
    throw new Error(`Document with ${argv.uuid} not found`)
  }

  if (!doc[argv.method]) {
    throw new Error(`Document with ${argv.uuid} doesnt have method ${argv.method}`)
  }

  if (argv.hydrate) {
    const hydrate = argv.hydrate.split(',')

    for (const item of hydrate) {
      const match = item.trim().match(/(\w+) from (\w+)/)

      if (match) {
        const arg = match[1]
        const hidrateModel = match[2]

        if (arg && hidrateModel && argv[arg] && models[hidrateModel]) {
          argv[arg] = await models[hidrateModel].findOne({ uuid: argv[arg] })
        }
      } else {
        throw new Error(`Invalid replacement for ${item}`)
      }
    }
  }

  return doc[argv.method](argv)
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}

// node tasks/run-model-static --model MODEL_NAME --static METHOD_NAME ..methodArgs
require('../config')
require('lib/databases/mongo')

const Task = require('lib/task')

const models = require('models')

const task = new Task(async function (argv) {
  if (!argv.model || !argv.static) {
    throw new Error('Argument model and static are required')
  }

  const model = models[argv.model]
  if (!model) {
    throw new Error(`Model ${argv.model} not found`)
  }

  if (!model[argv.static]) {
    throw new Error(`Document with ${argv.uuid} doesnt have static ${argv.method}`)
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

  return model[argv.static](argv)
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}

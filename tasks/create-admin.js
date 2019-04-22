// node tasks/create-admin --email admin@app.com --password foobar --screenName admin
require('../config')
require('lib/databases/mongo')
const _ = require('lodash')

const { User } = require('models')
const Task = require('lib/task')

const task = new Task(async function (argv) {
  if (!argv.password || !argv.email || !argv.screenName) {
    throw new Error('screenName, email and password are required')
  }

  argv.password = _.toString(argv.password)

  const admin = new User({
    email: argv.email,
    password: argv.password,
    screenName: argv.screenName,
    isAdmin: true,
    validEmail: true
  })

  await admin.save()

  return admin
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}

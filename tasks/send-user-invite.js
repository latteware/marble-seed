// node tasks/send-user-invite.js --email admin@app.comx
require('../config')
require('lib/databases/mongo')

const Task = require('lib/task')

const { User } = require('models')

const task = new Task(async function (argv) {
  if (!argv.email) {
    throw new Error('screenName, email and password are required')
  }

  const user = await User.findOne({ email: argv.email })

  console.log('in task =>', user)

  await user.sendInviteEmail()
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}

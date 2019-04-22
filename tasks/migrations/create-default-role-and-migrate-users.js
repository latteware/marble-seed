// node tasks/create-defaul-role-and-migrate-users --save
require('../../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const fs = require('fs')
const { User, Role } = require('models')

const today = new Date()
const timestamp = today.getTime()
const output = fs.createWriteStream(
  './tasks/migrations/logs/create-default-role-and-migrate-users-' + timestamp + '.txt'
)

const task = new Task(async function (argv) {
  console.log('Fetching users .....')
  var users = await User.find({})

  let defaultRole = await Role.findOne({ name: 'Default' })
  if (!defaultRole) {
    defaultRole = await Role.create({
      name: 'Default',
      slug: 'default',
      description: 'Default role',
      isDefault: true
    })
  }

  console.log('Applying migration .....')
  for (var user of users) {
    if (!user.role) {
      user.role = defaultRole

      if (argv.save) await user.save()
      else output.write(user.uuid + ' role: ' + user.role + '\n')
    }
  }

  return `Users ${users.length} users`
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}

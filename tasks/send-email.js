// node tasks/send-email --name Irvin --email irvin@commonsense.io --template customer-questionnaire --subject 'Orden generada'
require('../config')

const Task = require('lib/task')
const Mailer = require('lib/mailer')
const { appHost, adminHost, adminPrefix } = require('config/server')

const task = new Task(async function (argv) {
  const { template, name, email, subject, isString } = argv

  if (!argv.template) {
    throw new Error('template is required')
  }

  if (!argv.name) {
    throw new Error('name is required')
  }

  if (!argv.email) {
    throw new Error('email is required')
  }

  if (!argv.subject) {
    throw new Error('subject is required')
  }

  const mailer = new Mailer(template, isString)

  await mailer.format({
    ...argv,
    appHost,
    adminHost,
    adminPrefix
  })

  await mailer.send({
    recipient: { name, email },
    title: subject
  })

  console.log('Email Sent =>', argv.email)
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}

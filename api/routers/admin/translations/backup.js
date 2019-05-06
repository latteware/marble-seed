const Route = require('lib/router/route')
const backupTranslations = require('tasks/translations/backup-translations')

module.exports = new Route({
  method: 'post',
  path: '/backup',
  handler: async function (ctx) {
    await backupTranslations.run({})
    ctx.body = {
      data: 'success'
    }
  }
})

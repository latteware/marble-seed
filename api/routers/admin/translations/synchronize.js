const Route = require('lib/router/route')
const synchronizeTranslations = require('tasks/translations/synchronize-translations')

module.exports = new Route({
  method: 'post',
  path: '/synchronize',
  handler: async function (ctx) {
    await synchronizeTranslations.run({})
    ctx.body = {
      data: 'success'
    }
  }
})

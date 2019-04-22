require('../config')
require('lib/databases/mongo')

const Cron = require('lib/cron')

const cron = new Cron({
  tick: '* * * * *',
  task: async function () {
    console.log('Running cron =>', new Date())
    return { success: true }
  }
})

if (require.main === module) {
  cron.schedule()
} else {
  module.exports = cron
}

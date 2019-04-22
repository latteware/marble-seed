// node crons/check-preprocessing-progress
require('../config')
require('lib/databases/mongo')

const Cron = require('lib/cron')
const fetchBinData = require('tasks/samples/fetch-bin-data.js')

// This cron job starts a background job for sample task fetch-bin-data
// Run 'make queue-server' to gather the results
// Using bin 'oazdu' at myjson.com
const cron = new Cron({
  tick: '* * * * *',
  task: async function () {
    console.log('Running cron =>', new Date())

    const { jobId } = await fetchBinData.runAsBackgroundJob({ bin: 'oazdu' })
    return { success: true, jobId }
  }
})

if (require.main === module) {
  cron.schedule()
} else {
  module.exports = cron
}

require('../config')
require('lib/databases/mongo')

const fetchBinData = require('tasks/samples/fetch-bin-data.js')
fetchBinData.startAsQueue()
fetchBinData.setQueueLogger()

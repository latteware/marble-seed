const mongoose = require('mongoose')
const config = require('config/database')

mongoose.Promise = global.Promise
mongoose.connect(config.mongo.url, {})

module.exports = mongoose.connection

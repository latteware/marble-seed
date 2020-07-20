const mongoose = require('mongoose')
const config = require('config/database')

mongoose.Promise = global.Promise
mongoose.connect(config.mongo.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

module.exports = mongoose.connection

// node tasks/samples/set-bin-data.js --bin bin ..args
// bin string
require('../../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const request = require('lib/request')

const task = new Task(async function (argv) {
  var options = {
    method: 'POST',
    url: 'https://api.myjson.com/bins/',
    pathname: 'POST https://api.myjson.com/bins/',
    body: argv,
    json: true,
    persist: true
  }

  const res = await request(options)

  return res
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}

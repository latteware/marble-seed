// node tasks/samples/set-bin-data.js --bin bin ..args
// bin string
require('../../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const request = require('lib/request')

const task = new Task(async function (argv) {
  if (!argv.bin) {
    return console.error('Error: this task requires a bin name')
  }

  var options = {
    url: `https://api.myjson.com/bins/${argv.bin}`,
    pathname: 'GET https://api.myjson.com/bins/:bin',
    method: 'GET',
    json: true,
    persist: true
  }

  let res = await request(options)

  return res
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}

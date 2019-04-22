// node queues/{{ queue }}.js
require('../config')
require('lib/databases/mongo')

const Queue = require('lib/queue')

const queue = new Queue({
  name: '{{ queue }}',
  task: async function (data) {
    console.log('Running queue with =>', data)

    return { ...data, success: true }
  }
})

if (require.main === module) {
  queue.run()
  queue.setCliLogger()
  queue.setCleanUp()
} else {
  module.exports = queue
}

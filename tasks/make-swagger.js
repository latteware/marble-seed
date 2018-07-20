// node tasks/create-admin --email admin@app.com --password foobar --screenName admin
require('../config')
require('lib/databases/mongo')
// const YAML = require('json2yaml')
const yaml = require('write-yaml');
const _ = require('lodash')
const requireindex = require('es6-requireindex')
const path = require('path')

const Task = require('lib/task')
const routers = requireindex(path.join(__dirname, '../api/routers'), { recursive: false })
const task = new Task(function * (argv) {
  _.forEach(routers, (router, name) => {
    let endpoint = cleanObject(router)
    yaml('.swagger.yml', endpoint, function (err) {
      // do stuff with err
    })
  })
  function cleanObject (Obj) {
    let endpoint = {}
    Object.keys(Obj).forEach((item, index) => {
      if (Obj[item] && typeof Obj[item] === 'object') {
        endpoint[item] = cleanObject(Obj[item])
      } else if (typeof Obj[item] === 'string') {
        endpoint[item] = Obj[item]
      }
    })

    return endpoint
  }
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}

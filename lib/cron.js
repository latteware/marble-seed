const co = require('co')
const cron = require('node-cron')

class Cron {
  constructor (options) {
    this._fn = options.task
    this._timeout = options.timeout || 10
    this._tick = options.tick
  }

  schedule () {
    console.log('[Cron] Starting at', new Date())
    co(this._fn).then(data => {
      console.log('[Cron] Success:', data)
    })
      .catch(e => {
        console.error(e.message, e.stack)
      })

    cron.schedule(this._tick, (argument) => {
      co(this._fn).then(data => {
        console.log('[Cron] Success:', data)
      })
        .catch(e => {
          console.error(e.message, e.stack)
        })
    })
  }

  run () {
    var q = co(this._fn)

    if (this._cli) {
      q.then(data => {
        console.log('Success =>', data)

        setTimeout(() => process.exit(), this._timeout)
      }).catch(err => {
        console.error('=>', err)
        process.nextTick(() => process.exit(1))
      })
    }

    return q
  }

  setCliHandlers () {
    this._cli = true
  }
}

module.exports = Cron

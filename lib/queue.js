const Bull = require('bull')
const config = require('config')
const co = require('co')
const cron = require('node-cron')

const hour = 60 * 60 * 1000
const week = hour * 24 * 7

const Queue = class {
  constructor (options = {}) {
    this._name = options.name
    this._fn = options.task

    console.warn(`[Deprecation notice for v0.7.0]Queues are deprecated, use task.startAsQueue().`, new Date())
    console.log(`[${this._name}] Init`, new Date())
    this._queue = Bull(this._name, config.redis, { dropBufferSupport: true })
  }

  run (argv) {
    const taskName = this._name
    const fn = this._fn
    console.log(`[${taskName}] Starting queue`)

    this._queue.process(function (job, done) {
      co(async function () {
        const result = await fn(job.data)

        done(null, result)
      }).catch(done)
    })
  }

  add (data) {
    console.log('Adding =>', data)
    this._queue.add(data)
  }

  setCliLogger () {
    const taskName = this._name
    console.log(`[${taskName}] Setting cli logger`)

    this._queue.on('completed', function (job, results) {
      console.log(`${taskName} completed`, results)
    })

    this._queue.on('error', function (err) {
      console.log(`${taskName} err => ${err.message} ${err.stack}`)
    })

    this._queue.on('failed', function (job, err) {
      console.log(`${taskName} look ${job.data.lookId} failed => ${err.message || err}`)
    })

    this._queue.on('cleaned', function (jobs, type) {
      console.log(`${taskName} cleaned ${jobs.length} jobs of type ${type}`)
    })
  }

  setCleanUp () {
    const taskName = this._name
    console.log(`[${taskName}] Setting clean task`)

    cron.schedule('00 * * * *', () => {
      this._queue.clean(hour, 'completed')
      this._queue.clean(week, 'failed')
    })
  }
}

module.exports = Queue

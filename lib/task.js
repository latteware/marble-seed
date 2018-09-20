const parseArgs = require('minimist')
const co = require('co')

const Bull = require('bull')
const config = require('config')

const Task = class Task {
  constructor (fn, timeout = 10) {
    this._fn = fn
    this._timeout = timeout
  }

  setName (name) {
    this._name = name
  }

  run (argv) {
    const wrap = co.wrap(this._fn)
    argv = argv || parseArgs(process.argv.slice(2))

    let q
    if (argv.asBackground) {
      q = this.runAsBackgroundJob(argv)
    } else {
      q = wrap(argv)
    }

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

  runAsBackgroundJob (argv) {
    if (!this._name) { return console.log(`No name for this queue`) }

    if (!this._queue) {
      this._queue = Bull(this._name, config.redis, { dropBufferSupport: true })
    }

    console.log(`[${this._name}:runAsBackgroundJob] =>`, argv)
    const q = this._queue.add(argv)

    return q.then((job) => {
      return {
        jobId: job.id
      }
    })
  }

  startAsQueue () {
    if (!this._name) { return console.log(`No name for this queue`) }

    console.log(`[${this._name}] Init`, new Date())
    this._queue = Bull(this._name, config.redis, { dropBufferSupport: true })

    const fn = this._fn
    console.log(`[${this._name}] Starting queue`)

    this._queue.process(function (job, done) {
      co(async function () {
        const result = await fn(job.data)

        done(null, result)
      }).catch(done)
    })
  }

  setCliHandlers () {
    this._cli = true
  }

  setQueueLogger () {
    const taskName = this._name
    if (!this._queue) { return console.log(`No queue for ${taskName}`) }

    console.log(`[${taskName}] Setting cli logger`)
    this._queue.on('completed', function (job, results) {
      console.log('==========================================')
      console.log(`[${taskName}] ${job.id} completed.`)
      console.log(`Arguments: \n`, job.data)
      console.log(`Result: \n`, results)
      console.log('==========================================')
    })

    this._queue.on('error', function (err) {
      console.log(`[${taskName}] err => ${err.message} ${err.stack}`)
    })

    this._queue.on('failed', function (job, err) {
      console.log(`[${taskName}] failed => ${err.message || err}`)
    })

    this._queue.on('cleaned', function (jobs, type) {
      console.log(`[${taskName}] cleaned ${jobs.length} jobs of type ${type}`)
    })
  }
}

module.exports = Task

const Route = require('lib/router/route')
const { Email } = require('models')
const Mailer = require('lib/mailer')

module.exports = new Route({
  method: 'post',
  path: '/:uuid/try',
  handler: async function (ctx) {
    let { uuid } = ctx.params
    let { user } = ctx.state
    let data = ctx.request.body

    const email = await Email.findOne({ 'uuid': uuid })
    ctx.assert(email, 404, 'Email not found')

    let layout = email.content
    const mail = new Mailer(layout, true)
    await mail.format(data)
    await mail.send({
      recipient: {
        email: user.email,
        name: user.userName
      },
      title: email.name
    })

    ctx.body = {
      success: true
    }
  }
})

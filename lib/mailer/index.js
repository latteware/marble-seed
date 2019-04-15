'use strict'
const mandrill = require('mandrill-api/mandrill')
const nunjucks = require('nunjucks')
const inlineCss = require('inline-css')
const path = require('path')
const fs = require('fs-extra')
const config = require('config/mailer')

const render = function (template, data, isString) {
  return new Promise(function (resolve, reject) {
    if (isString) {
      nunjucks.renderString(template, data, function (err, res) {
        if (err) { return reject(err) }
        resolve(res)
      })
    } else {
      nunjucks.render(template, data, function (err, res) {
        if (err) { return reject(err) }

        resolve(res)
      })
    }
  })
}

const inline = function (html) {
  // Load a css file
  return inlineCss(html, { url: 'file://' })
}

if (!config.active) {
  console.warn('Emails will not be sent!!')
}

const client = new mandrill.Mandrill(config.mailchimpKey)

client.sendEmail = function (conf) {
  var q = new Promise(function (resolve, reject) {
    var message = {
      from_email: conf.sender.email,
      from_name: conf.sender.name
    }

    if (!config.active) {
      console.log(`Email not send, body => \n ${conf.body} \n`)
      return resolve()
    }

    message.html = conf.body
    message.subject = conf.title
    if (conf.recipient) {
      message.to = [{
        email: conf.recipient.email,
        name: conf.recipient.name
      }]
    } else {
      message.to = conf.recipients
    }

    if (!config.active) {
      console.log(`Email not send, body => \n ${conf.body} \n`)
      return resolve()
    }

    client.messages.send({
      'message': message,
      'async': false,
      'ip_pool': 'Main pool'
    }, function (result) {
      resolve(result)
    }, function (err) {
      reject(err)
    })
  })

  return q
}

module.exports = class Mail {
  constructor (template, isString) {
    this.template = template
    this.isString = isString
  }

  async format (data) {
    let template
    if (this.isString) {
      template = this.template
    } else {
      template = path.join('./api/email-templates', this.template + '.html')
    }

    const body = await render(template, data, this.isString)
    this.body = await inline(body)
  }

  async send (options) {
    options = options || {}
    if (!options.sender) { options.sender = config.sender }

    let response = await client.sendEmail({
      body: this.body,
      title: options.title,
      recipient: options.recipient,
      recipients: options.recipients,
      sender: options.sender
    })

    return response
  }
}

const Route = require('lib/router/route')
const { {{ name | capitalize }} } = require('models')

module.exports = new Route({
  method: 'post',
  path: '/:uuid/restore',
  handler: async function (ctx) {
    var {{ name | lower }}Id = ctx.params.uuid

    const {{ name | lower }} = await {{ name | capitalize }}.findOne({'uuid': {{ name | lower }}Id, 'isDeleted': true})
    ctx.assert({{ name | lower }}, 404, '{{ name | capitalize }} not found')

    {{ name | lower }}.set({
      isDeleted: false
    })

    {{ name | lower }}.save()

    ctx.body = {
      data: {{ name | lower }}.toAdmin()
    }
  }
})

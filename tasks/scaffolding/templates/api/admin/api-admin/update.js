const Route = require('lib/router/route')
const lov = require('lov')
const { {{ name | capitalize }} } = require('models')

module.exports = new Route({
  method: 'post',
  path: '/:uuid',
  validator: lov.object().keys({
    {% for item in fields -%}
      {% if item.isRequired -%}
        {{ item.name }}: lov.{{ item.type | lower }}().required(),
      {% endif -%}
    {% endfor -%}
  }),
  handler: async function (ctx) {
    var {{ name | lower }}Id = ctx.params.uuid
    var data = ctx.request.body

    const {{ name | lower }} = await {{ name | capitalize }}.findOne({'uuid': {{ name | lower }}Id, 'isDeleted': false})
    ctx.assert({{ name | lower }}, 404, '{{ name | capitalize }} not found')

    {{ name | lower }}.set({
      {% for item in fields -%}
          {{ item.name }}: data.{{ item.name }},
      {% endfor -%}
    })

    await {{ name | lower }}.save()

    ctx.body = {
      data: {{ name | lower }}.toAdmin()
    }
  }
})

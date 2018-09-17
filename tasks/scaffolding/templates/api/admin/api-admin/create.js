const Route = require('lib/router/route')
const lov = require('lov')
const { {{ name | capitalize }} } = require('models')

module.exports = new Route({
  method: 'post',
  path: '/',
  validator: lov.object().keys({
    {% for item in fields -%}
      {% if item.isRequired -%}
        {{ item.name }}: lov.{{ item.type | lower }}().required(),
      {% endif -%}
    {% endfor -%}
  }),
  handler: async function (ctx) {
    var data = ctx.request.body

    const {{ name | lower }} = await {{ name | capitalize }}.create({
      {% for item in fields -%}
        {{ item.name }}: data.{{ item.name }},
      {% endfor -%}
    })

    ctx.body = {
      data: {{ name | lower }}.toAdmin()
    }
  }
})

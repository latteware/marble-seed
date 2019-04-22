const Route = require('lib/router/route')
const lov = require('lov')
const slugify = require('underscore.string/slugify')

const { Role } = require('models')

module.exports = new Route({
  method: 'post',
  path: '/:uuid',
  validator: lov.object().keys({
    name: lov.string().required()
  }),
  handler: async function (ctx) {
    var roleId = ctx.params.uuid
    var data = ctx.request.body

    const role = await Role.findOne({ 'uuid': roleId })
    ctx.assert(role, 404, 'Role not found')

    data.slug = slugify(data.name)
    role.set(data)

    role.save()

    ctx.body = {
      data: role.toAdmin()
    }
  }
})

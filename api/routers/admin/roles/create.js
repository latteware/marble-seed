const Route = require('lib/router/route')
const lov = require('lov')
const slugify = require('underscore.string/slugify')

const { Role } = require('models')

module.exports = new Route({
  method: 'post',
  path: '/',
  validator: lov.object().keys({
    name: lov.string().required()
  }),
  handler: async function (ctx) {
    var data = ctx.request.body

    data.slug = slugify(data.name)
    const auxRole = await Role.findOne({ slug: data.slug })
    if (auxRole && !auxRole.isDeleted) {
      ctx.throw(400, "You can't have two roles with the same name")
    }

    if (auxRole && auxRole.isDeleted) {
      auxRole.isDeleted = false
      auxRole.save()

      ctx.body = {
        data: auxRole.toAdmin()
      }

      return
    }

    const role = await Role.create(data)

    ctx.body = {
      data: role.toAdmin()
    }
  }
})

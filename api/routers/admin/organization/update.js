const Route = require('lib/router/route')
const lov = require('lov')
const slugify = require('underscore.string/slugify')

const { Organization } = require('models')

module.exports = new Route({
  method: 'post',
  path: '/:uuid',
  validator: lov.object().keys({
    name: lov.string().required()
  }),
  handler: async function (ctx) {
    var organizationId = ctx.params.uuid
    var data = ctx.request.body

    const org = await Organization.findOne({ 'uuid': organizationId })
    ctx.assert(org, 404, 'Organization not found')

    data.slug = slugify(data.name)
    org.set(data)
    org.save()

    ctx.body = {
      data: org.toAdmin()
    }
  }
})

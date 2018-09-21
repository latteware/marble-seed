const Route = require('lib/router/route')
const lov = require('lov')

const {Article} = require('models')

module.exports = new Route({
  method: 'post',
  path: '/',
  validator: lov.object().keys({
    title: lov.string().required(),
    description: lov.string().required()
  }),
  handler: async function (ctx) {
    var data = ctx.request.body

    data.status = 'draft'
    data.author = ctx.state.user
    const article = await Article.create(data)

    ctx.body = {
      data: article.toAdmin()
    }
  }
})

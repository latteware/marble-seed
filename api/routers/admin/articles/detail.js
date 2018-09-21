const Route = require('lib/router/route')

const {Article} = require('models')

module.exports = new Route({
  method: 'get',
  path: '/:uuid',
  handler: async function (ctx) {
    let {uuid} = ctx.params

    const article = await Article.findOne({'uuid': uuid}).populate('author')
    ctx.assert(article, 404, 'Article not found')

    ctx.body = {
      data: article.toAdmin()
    }
  }
})

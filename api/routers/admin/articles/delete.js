const Route = require('lib/router/route')

const {Article} = require('models')

module.exports = new Route({
  method: 'delete',
  path: '/:uuid',
  handler: async function (ctx) {
    var articleId = ctx.params.uuid

    var article = await Article.findOne({'uuid': articleId})
    ctx.assert(article, 404, 'Article not found')

    article.set({isDeleted: true})
    article.save()

    ctx.body = {
      data: article.toAdmin()
    }
  }
})

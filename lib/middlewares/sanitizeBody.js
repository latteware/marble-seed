const { tvs } = require('lib/tools')

module.exports = async function (ctx, next) {
  const headers = ctx.request.headers
  let body = ctx.request.body

  if (headers['content-type'] && headers['content-type'] === 'application/json') {
    body = tvs(ctx.request.body)
  }

  ctx.request.body = body

  await next()
}

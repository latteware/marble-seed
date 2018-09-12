const Route = require('lib/router/route')
const {User} = require('models')
const parse = require('csv-parse/lib/sync')
const lov = require('lov')

module.exports = new Route({
  method: 'post',
  path: '/import',
  handler: async function (ctx) {
    const {file} = ctx.request.body
    const dataType = file.mimeType

    if (dataType !== 'text/csv' && dataType !== 'text/plain') {
      ctx.throw(400, 'The file should be a CSV file!')
    }

    var data = parse(file.content, {columns: true})

    const schema = lov.array().required().items(
      lov.object().keys({
        email: lov.string().required(),
        password: lov.string().required(),
        name: lov.string().required(),
        screenName: lov.string().required()
      })
    )

    let result = lov.validate(data, schema)

    if (result.error) {
      ctx.throw(400, result.error)
    }

    for (var d of data) {
      await User.create(d)
    }

    ctx.body = {message: `Se han creado ${data.length} usuarios satisfactoriamente!`}
  }
})

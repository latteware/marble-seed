const Route = require('lib/router/route')

const { Translation } = require('models')

module.exports = new Route({
    method: 'get',
    path: '/translations/:lang',
    handler: async function (ctx) {
        var lang = ctx.params.lang

        const translations = await Translation.find({ 'lang': lang })
        ctx.assert(translations, 404, 'Lang not found')

        ctx.body = {
            data: translations
        }
    }
})

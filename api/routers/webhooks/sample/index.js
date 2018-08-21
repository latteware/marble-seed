const Router = require('lib/router/router')
const {saveRequestLog} = require('lib/middlewares')

module.exports = new Router({
  routes: require('es6-requireindex')(__dirname, { recursive: false }),
  middlewares: [saveRequestLog],  
  prefix: '/sample'
})

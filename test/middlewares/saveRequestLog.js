/* global describe, beforeEach, it */
require('co-mocha')

const { expect, assert } = require('chai')
const http = require('http')
const { clearDatabase } = require('../utils')
const Koa = require('koa')
const request = require('supertest')
const { RequestLog } = require('models')

const Router = require('lib/router/router')
const Route = require('lib/router/route')
const saveRequestLog = require('lib/middlewares/saveRequestLog')

function test () {
  const app = new Koa()

  const successRoute = new Route({
    method: 'get',
    path: '/success',
    handler: async function (ctx) {
      ctx.body = { success: true }
    }
  })

  const notFoundRoute = new Route({
    method: 'get',
    path: '/404',
    handler: async function (ctx) {
      ctx.throw(404)
    }
  })

  const forbbidenRoute = new Route({
    method: 'get',
    path: '/403',
    handler: async function (ctx) {
      ctx.throw(403)
    }
  })

  const invalidSintaxRoute = new Route({
    method: 'get',
    path: '/500',
    handler: async function (ctx) {
      console('WTF?')
    }
  })

  const router = new Router({
    routes: {
      successRoute,
      notFoundRoute,
      forbbidenRoute,
      invalidSintaxRoute
    },
    prefix: '/api',
    middlewares: [saveRequestLog]
  })

  router.add(app)

  return request(http.createServer(app.callback()))
}

describe('Request logs', () => {
  beforeEach(async function () {
    await clearDatabase()
  })

  describe('[get] /Create a request log', () => {
    it('should return a 200 with a request', async function () {
      const prev = await RequestLog.count({})
      assert.equal(0, prev, 'There are previous requests')
      await test()
        .get('/api/success')
        .set('Accept', 'application/json')
        .expect(200)

      const after = await RequestLog.count({})
      // find request log w good response
      assert.notEqual(0, after, 'Succesfully created request')
    })
  })

  describe('[get] /Create wrong request-log', () => {
    it('should create the request-log with 404 error', async function () {
      await test()
        .get('/api/404')
        .set('Accept', 'application/json')
        .expect(404)

      // find request log w error
      const errorLog = await RequestLog.findOne({})

      expect(errorLog).to.have.property('error')
      expect(errorLog.status).equal(404)
    })

    it('should create the request-log with 403 error', async function () {
      await test()
        .get('/api/403')
        .set('Accept', 'application/json')
        .expect(403)

      // find request log w error
      const errorLog = await RequestLog.findOne({})

      expect(errorLog).to.have.property('error')
      expect(errorLog.status).equal(403)
    })

    it('should create the request-log with 500 error', async function () {
      await test()
        .get('/api/500')
        .set('Accept', 'application/json')
        .expect(500)

      // find request log w error
      const errorLog = await RequestLog.findOne({})

      expect(errorLog).to.have.property('error')
      expect(errorLog.status).equal(500)
    })
  })
})

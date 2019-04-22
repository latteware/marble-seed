/* global describe, beforeEach, it */
require('co-mocha')

const { expect } = require('chai')
const http = require('http')
const { clearDatabase } = require('../utils')
const api = require('api/')
const request = require('supertest')
const { RequestLog } = require('models')

function test () {
  return request(http.createServer(api.callback()))
}

describe('Request logs', () => {
  beforeEach(async function () {
    await clearDatabase()
  })

  describe('[get] / list request logs', () => {
    it('should return a 200 with a 0 request logs', async function () {
      const res = await test()
        .get('/api/admin/request-logs')
        .set('Accept', 'application/json')
        .expect(200)

      // find request log w good response
      expect(res.body.data.length).equal(0)
    })

    it('should return a 200 with a 2 request logs', async function () {
      await RequestLog.create([{}, {}])
      const res = await test()
        .get('/api/admin/request-logs')
        .set('Accept', 'application/json')
        .expect(200)

      // find request log w good response
      expect(res.body.data.length).equal(2)
    })

    it('should return a 200 with a 2 request logs', async function () {
      await RequestLog.create([{ pathname: 'GET /api/me' }, { pathname: 'POST /api/me' }])
      const res = await test()
        .get('/api/admin/request-logs?pathname=GET /api/me')
        .set('Accept', 'application/json')
        .expect(200)

      // find request log w good response
      expect(res.body.data.length).equal(1)
    })
  })
})

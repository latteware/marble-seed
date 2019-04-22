/* global describe, beforeEach, it */
require('co-mocha')

const { expect } = require('chai')
const http = require('http')
const { clearDatabase } = require('../utils')
const api = require('api/')
const request = require('supertest')
const { AppConfig } = require('models')

function test () {
  return request(http.createServer(api.callback()))
}

describe('App Config public API', () => {
  beforeEach(async function () {
    await clearDatabase()
  })

  describe('[get] /', () => {
    it('should return a 200 as empty', async function () {
      const res = await test()
        .get('/api/app-config')
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body).to.deep.equal({})
    })

    it('should return a 200 with {foo: \'bar\'}', async function () {
      await AppConfig.create({
        key: 'foo',
        value: 'bar',
        type: 'string'
      })

      const res = await test()
        .get('/api/app-config')
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.foo).equal('bar')
    })

    it('should return a 200 with multiple keys and types', async function () {
      await AppConfig.create([
        { key: 'foo', type: 'string', value: 'simple' },
        { key: 'bar', type: 'number', value: 1 },
        { key: 'quz', type: 'array', value: [1, 2, 3] },
        { key: 'qip', type: 'object', value: { active: true } }
      ])

      const res = await test()
        .get('/api/app-config')
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.foo).equal('simple')
      expect(res.body.bar).equal(1)
      expect(res.body.quz).to.deep.equal([1, 2, 3])
      expect(res.body.qip).to.deep.equal({ active: true })
    })
  })
})

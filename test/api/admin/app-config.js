/* global describe, beforeEach, it */
require('co-mocha')

const { expect } = require('chai')
const http = require('http')
const { clearDatabase } = require('../../utils')
const api = require('api/')
const request = require('supertest')
const {AppConfig} = require('models')

function test () {
  return request(http.createServer(api.callback()))
}

describe('App Config admin API', () => {
  beforeEach(async function () {
    await clearDatabase()
  })

  describe('[get] /', () => {
    it('should return a 200 as empty', async function () {
      const res = await test()
        .get('/api/admin/app-config')
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body).to.deep.equal([])
    })

    it('should return a 200 with foo config', async function () {
      await AppConfig.create({
        key: 'foo',
        value: 'bar',
        type: 'string'
      })

      const res = await test()
        .get('/api/admin/app-config')
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.length).equal(1)
      expect(res.body[0].key).equal('foo')
      expect(res.body[0].value).equal('bar')
      expect(res.body[0].type).equal('string')
    })
  })

  describe('[get] /:key Details', () => {
    it('should return a 404', async function () {
      await test()
        .get('/api/admin/app-config/uuid')
        .set('Accept', 'application/json')
        .expect(404)
    })

    it('should return a 200 with foo config', async function () {
      const config = await AppConfig.create({
        key: 'foo',
        value: 'bar',
        type: 'string'
      })

      const res = await test()
        .get('/api/admin/app-config/' + config.key)
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.key).equal('foo')
      expect(res.body.value).equal('bar')
      expect(res.body.type).equal('string')
    })
  })

  describe('[post] / Create', () => {
    it('should return a 422 if no key is provided', async function () {
      const res = await test()
        .post('/api/admin/app-config')
        .send({
          type: 'string'
        })
        .set('Accept', 'application/json')

      expect(res.status).equal(422)
      expect(res.body.message).equal('value: key: missing required value')
    })

    it('should return a 422 if no type is provided', async function () {
      const res = await test()
        .post('/api/admin/app-config')
        .send({
          key: 'foo'
        })
        .set('Accept', 'application/json')

      expect(res.status).equal(422)
      expect(res.body.message).equal('value: type: missing required value')
    })

    it('should return a 422 for invalid type', async function () {
      const res = await test()
        .post('/api/admin/app-config')
        .send({
          key: 'foo',
          type: 'something',
          value: 'bar'
        })
        .set('Accept', 'application/json')

      expect(res.status).equal(422)
      expect(res.body.message).equal('invalid type')
    })

    it('should return a 422 for invalid key format', async function () {
      const res = await test()
        .post('/api/admin/app-config')
        .send({
          key: 'foo bar',
          type: 'string',
          value: 'bar'
        })
        .set('Accept', 'application/json')

      expect(res.status).equal(422)
      expect(res.body.message).equal('invalid key format')
    })

    it('should return a 412 for unique key', async function () {
      await AppConfig.create({
        key: 'foo',
        value: 'bar',
        type: 'string'
      })

      const res = await test()
        .post('/api/admin/app-config')
        .send({
          key: 'foo',
          type: 'string',
          value: 'quz'
        })
        .set('Accept', 'application/json')

      expect(res.status).equal(412)
      expect(res.body.message).equal('key already exits')
    })

    it('should return a 200 for boolean config with true', async function () {
      const res = await test()
        .post('/api/admin/app-config')
        .send({
          key: 'foo',
          type: 'boolean',
          value: true
        })
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.key).equal('foo')
      expect(res.body.type).equal('boolean')
      expect(res.body.value).equal(true)
    })

    it('should return a 200 for boolean config with false', async function () {
      const res = await test()
        .post('/api/admin/app-config')
        .send({
          key: 'foo',
          type: 'boolean',
          value: false
        })
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.key).equal('foo')
      expect(res.body.type).equal('boolean')
      expect(res.body.value).equal(false)
    })

    it('should return a 200 for number config', async function () {
      const res = await test()
        .post('/api/admin/app-config')
        .send({
          key: 'foo',
          type: 'number',
          value: 5
        })
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.key).equal('foo')
      expect(res.body.type).equal('number')
      expect(res.body.value).equal(5)
    })

    it('should return a 200 for string config', async function () {
      const res = await test()
        .post('/api/admin/app-config')
        .send({
          key: 'foo',
          type: 'string',
          value: 'bar'
        })
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.key).equal('foo')
      expect(res.body.type).equal('string')
      expect(res.body.value).equal('bar')
    })

    it('should return a 200 for array config', async function () {
      const res = await test()
        .post('/api/admin/app-config')
        .send({
          key: 'foo',
          type: 'array',
          value: [1, 2, 3]
        })
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.key).equal('foo')
      expect(res.body.type).equal('array')
      expect(res.body.value).to.deep.equal([1, 2, 3])
    })

    it('should return a 200 for object config', async function () {
      const res = await test()
        .post('/api/admin/app-config')
        .send({
          key: 'foo',
          type: 'object',
          value: {active: true}
        })
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.key).equal('foo')
      expect(res.body.type).equal('object')
      expect(res.body.value).to.deep.equal({active: true})
    })

    it('should return a 422 for invalid boolean', async function () {
      const res = await test()
        .post('/api/admin/app-config')
        .send({
          key: 'foo',
          type: 'boolean',
          value: 'bar'
        })
        .set('Accept', 'application/json')

      expect(res.status).equal(422)
      expect(res.body.message).equal('invalid boolean')
    })

    it('should return a 422 for invalid number', async function () {
      const res = await test()
        .post('/api/admin/app-config')
        .send({
          key: 'foo',
          type: 'number',
          value: 'bar'
        })
        .set('Accept', 'application/json')

      expect(res.status).equal(422)
      expect(res.body.message).equal('invalid number')
    })

    it('should return a 422 for invalid string', async function () {
      const res = await test()
        .post('/api/admin/app-config')
        .send({
          key: 'foo',
          type: 'string',
          value: 5
        })
        .set('Accept', 'application/json')

      expect(res.status).equal(422)
      expect(res.body.message).equal('invalid string')
    })

    it('should return a 422 for invalid array', async function () {
      const res = await test()
        .post('/api/admin/app-config')
        .send({
          key: 'foo',
          type: 'array',
          value: 5
        })
        .set('Accept', 'application/json')

      expect(res.status).equal(422)
      expect(res.body.message).equal('invalid array')
    })

    it('should return a 422 for invalid object', async function () {
      const res = await test()
        .post('/api/admin/app-config')
        .send({
          key: 'foo',
          type: 'object',
          value: 5
        })
        .set('Accept', 'application/json')

      expect(res.status).equal(422)
      expect(res.body.message).equal('invalid object')
    })
  })

  describe('[post] /:key Update', () => {
    it('should return a 404', async function () {
      await test()
        .post('/api/admin/app-config/uuid')
        .send({
          key: 'foo',
          type: 'string',
          value: 'bar'
        })
        .set('Accept', 'application/json')
        .expect(404)
    })

    it('should return a 200 and updated config', async function () {
      const config = await AppConfig.create({
        key: 'foo',
        value: 'bar',
        type: 'string'
      })

      const res = await test()
        .post('/api/admin/app-config/' + config.key)
        .send({
          value: 'quz'
        })
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.key).equal('foo')
      expect(res.body.type).equal('string')
      expect(res.body.value).equal('quz')

      const newConfig = await AppConfig.findOne({key: 'foo'})
      expect(newConfig.value).equal('quz')
    })

    it('should return a 200 for boolean config with true', async function () {
      const config = await AppConfig.create({
        key: 'foo',
        value: false,
        type: 'boolean'
      })

      const res = await test()
        .post('/api/admin/app-config/' + config.key)
        .send({
          value: true
        })
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.key).equal('foo')
      expect(res.body.type).equal('boolean')
      expect(res.body.value).equal(true)

      const newConfig = await AppConfig.findOne({key: 'foo'})
      expect(newConfig.value).equal(true)
    })

    it('should return a 200 for boolean config with false', async function () {
      const config = await AppConfig.create({
        key: 'foo',
        value: true,
        type: 'boolean'
      })

      const res = await test()
        .post('/api/admin/app-config/' + config.key)
        .send({
          value: false
        })
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.key).equal('foo')
      expect(res.body.type).equal('boolean')
      expect(res.body.value).equal(false)

      const newConfig = await AppConfig.findOne({key: 'foo'})
      expect(newConfig.value).equal(false)
    })

    it('should return a 200 and updated config value to null', async function () {
      const config = await AppConfig.create({
        key: 'foo',
        value: 'bar',
        type: 'string'
      })

      const res = await test()
        .post('/api/admin/app-config/' + config.key)
        .send({})
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.key).equal('foo')
      expect(res.body.type).equal('string')
      expect(res.body.value).equal(undefined)

      const newConfig = await AppConfig.findOne({key: 'foo'})
      expect(newConfig.value).equal(undefined)
    })

    it('should return a 422 for invalid boolean', async function () {
      const config = await AppConfig.create({
        key: 'foo',
        value: true,
        type: 'boolean'
      })

      const res = await test()
        .post('/api/admin/app-config/' + config.key)
        .send({value: 'string'})
        .set('Accept', 'application/json')

      expect(res.status).equal(422)
      expect(res.body.message).equal('invalid boolean')
    })

    it('should return a 422 for invalid number', async function () {
      const config = await AppConfig.create({
        key: 'foo',
        value: 5,
        type: 'number'
      })

      const res = await test()
        .post('/api/admin/app-config/' + config.key)
        .send({value: 'string'})
        .set('Accept', 'application/json')

      expect(res.status).equal(422)
      expect(res.body.message).equal('invalid number')
    })

    it('should return a 422 for invalid string', async function () {
      const config = await AppConfig.create({
        key: 'foo',
        value: 'bar',
        type: 'string'
      })

      const res = await test()
        .post('/api/admin/app-config/' + config.key)
        .send({value: false})
        .set('Accept', 'application/json')

      expect(res.status).equal(422)
      expect(res.body.message).equal('invalid string')
    })

    it('should return a 422 for invalid array', async function () {
      const config = await AppConfig.create({
        key: 'foo',
        value: [1, 2, 3],
        type: 'array'
      })

      const res = await test()
        .post('/api/admin/app-config/' + config.key)
        .send({value: 'string'})
        .set('Accept', 'application/json')

      expect(res.status).equal(422)
      expect(res.body.message).equal('invalid array')
    })

    it('should return a 422 for invalid object', async function () {
      const config = await AppConfig.create({
        key: 'foo',
        value: {active: true},
        type: 'object'
      })

      const res = await test()
        .post('/api/admin/app-config/' + config.key)
        .send({value: 'string'})
        .set('Accept', 'application/json')

      expect(res.status).equal(422)
      expect(res.body.message).equal('invalid object')
    })
  })

  describe('[delete] /:key', () => {
    it('should return a 404', async function () {
      await test()
        .del('/api/admin/app-config/uuid')
        .set('Accept', 'application/json')
        .expect(404)
    })

    it('should return a 200 and updated config value to null', async function () {
      const config = await AppConfig.create({
        key: 'foo',
        value: 'bar',
        type: 'string'
      })

      const res = await test()
        .del('/api/admin/app-config/' + config.key)
        .set('Accept', 'application/json')
        .expect(200)

      const count = await AppConfig.count()
      expect(res.body.success).equal(true)
      expect(count).equal(0)
    })
  })
})

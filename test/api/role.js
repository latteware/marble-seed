/* global describe, before, it */
require('co-mocha')

const { expect } = require('chai')
const http = require('http')
const { clearDatabase } = require('../utils')
const api = require('api/')
const request = require('supertest')
const { Role } = require('models')

function test () {
  return request(http.createServer(api.callback()))
}

describe('Role CRUD', () => {
  var roleUuid = ''
  before(async function () {
    await clearDatabase()
  })

  describe('[post] /Create a role', () => {
    it('should return a 422 if no data is provided', async function () {
      await test()
        .post('/api/admin/roles')
        .set('Accept', 'application/json')
        .expect(422)
    })

    it('should return a 422 if no name is provided', async function () {
      await test()
        .post('/api/admin/roles')
        .send({
          description: 'Una descripción'
        })
        .set('Accept', 'application/json')
        .expect(422)
    })

    it('should return a 200 and the role created', async function () {
      const res = await test()
        .post('/api/admin/roles')
        .send({
          name: 'Un role',
          description: 'Una descripción'
        })
        .set('Accept', 'application/json')
        .expect(200)

      roleUuid = res.body.data.uuid
      const newOrg = await Role.findOne({ 'uuid': roleUuid })
      expect(newOrg.name).equal('Un role')
      expect(newOrg.description).equal('Una descripción')
    })
  })

  describe('[post] /Update a role', () => {
    it('should return a 422 if no data is provided', async function () {
      await test()
        .post('/api/admin/roles/' + roleUuid)
        .set('Accept', 'application/json')
        .expect(422)
    })

    it('should return a 422 if no name is provided', async function () {
      await test()
        .post('/api/admin/roles/' + roleUuid)
        .send({
          description: 'Una descripción'
        })
        .set('Accept', 'application/json')
        .expect(422)
    })

    it("should return a 404 if the role isn't found", async function () {
      await test()
        .post('/api/admin/roles/blaaaaaa')
        .send({
          name: 'Un role',
          description: 'Otra descripción'
        })
        .set('Accept', 'application/json')
        .expect(404)
    })

    it('should return a 200 and the role updated', async function () {
      await test()
        .post('/api/admin/roles/' + roleUuid)
        .send({
          name: 'Un role',
          description: 'Otra descripción'
        })
        .set('Accept', 'application/json')
        .expect(200)

      const newOrg = await Role.findOne({ 'uuid': roleUuid })
      expect(newOrg.name).equal('Un role')
      expect(newOrg.description).equal('Otra descripción')
    })
  })

  describe('[get] A role', () => {
    it("should return a 404 if the role isn't found", async function () {
      await test()
        .get('/api/admin/roles/blaaaaaa')
        .set('Accept', 'application/json')
        .expect(404)
    })

    it('should return a 200 and the role requested', async function () {
      const res = await test()
        .get('/api/admin/roles/' + roleUuid)
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.data.name).equal('Un role')
      expect(res.body.data.description).equal('Otra descripción')
    })
  })

  describe('[delete] A role', () => {
    it("should return a 404 if the role isn't found", async function () {
      await test()
        .delete('/api/admin/roles/blaaaaaa')
        .set('Accept', 'application/json')
        .expect(404)
    })

    it('should return a 200 and set isDeleted to true', async function () {
      await test()
        .delete('/api/admin/roles/' + roleUuid)
        .set('Accept', 'application/json')
        .expect(200)

      const newOrg = await Role.findOne({ 'uuid': roleUuid })
      expect(newOrg.isDeleted).equal(true)
    })
  })
})

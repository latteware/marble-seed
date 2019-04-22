/* global describe, before, it */
require('co-mocha')

const { expect } = require('chai')
const http = require('http')
const { clearDatabase } = require('../utils')
const api = require('api/')
const request = require('supertest')
const { Organization } = require('models')

function test () {
  return request(http.createServer(api.callback()))
}

describe('Organization CRUD', () => {
  var orgUuid = ''
  var userUuid = ''

  before(async function () {
    await clearDatabase()
  })

  describe('[post] /Create an organization', () => {
    it('should return a 422 if no data is provided', async function () {
      await test()
        .post('/api/admin/organizations')
        .set('Accept', 'application/json')
        .expect(422)
    })

    it('should return a 422 if no name is provided', async function () {
      await test()
        .post('/api/admin/organizations')
        .send({
          description: 'Una descripción'
        })
        .set('Accept', 'application/json')
        .expect(422)
    })

    it('should return a 200 and the org created', async function () {
      const res = await test()
        .post('/api/admin/organizations')
        .send({
          name: 'Una org',
          description: 'Una descripción'
        })
        .set('Accept', 'application/json')
        .expect(200)

      orgUuid = res.body.data.uuid
      const newOrg = await Organization.findOne({ 'uuid': orgUuid })
      expect(newOrg.name).equal('Una org')
      expect(newOrg.description).equal('Una descripción')
    })
  })

  describe('[post] /Update an organization', () => {
    it('should return a 422 if no data is provided', async function () {
      await test()
        .post('/api/admin/organizations/' + orgUuid)
        .set('Accept', 'application/json')
        .expect(422)
    })

    it('should return a 422 if no name is provided', async function () {
      await test()
        .post('/api/admin/organizations/' + orgUuid)
        .send({
          description: 'Una descripción'
        })
        .set('Accept', 'application/json')
        .expect(422)
    })

    it("should return a 404 if the org isn't found", async function () {
      await test()
        .post('/api/admin/organizations/blaaaaaa')
        .send({
          name: 'Una org',
          description: 'Otra descripción'
        })
        .set('Accept', 'application/json')
        .expect(404)
    })

    it('should return a 200 and the org updated', async function () {
      await test()
        .post('/api/admin/organizations/' + orgUuid)
        .send({
          name: 'Una org',
          description: 'Otra descripción'
        })
        .set('Accept', 'application/json')
        .expect(200)

      const newOrg = await Organization.findOne({ 'uuid': orgUuid })
      expect(newOrg.name).equal('Una org')
      expect(newOrg.description).equal('Otra descripción')
    })
  })

  describe('[get] An organization', () => {
    it("should return a 404 if the org isn't found", async function () {
      await test()
        .get('/api/admin/organizations/blaaaaaa')
        .set('Accept', 'application/json')
        .expect(404)
    })

    it('should return a 200 and the org requested', async function () {
      const res = await test()
        .get('/api/admin/organizations/' + orgUuid)
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.data.name).equal('Una org')
      expect(res.body.data.description).equal('Otra descripción')
    })
  })

  describe('[post] Add user to an organization', () => {
    before(async function () {
      const email = 'app@user.com'
      const res = await test()
        .post('/api/user')
        .send({
          password: '4321',
          email: email,
          displayName: 'App User',
          screenName: 'au'
        })
        .set('Accept', 'application/json')
        .expect(200)

      userUuid = res.body.user.uuid
    })

    it('should return a 404', async function () {
      await test()
        .get('/api/admin/users/' + userUuid + '/add/organization')
        .set('Accept', 'application/json')
        .expect(404)
    })

    it("should return a 404 if the organization isn't found", async function () {
      await test()
        .post('/api/admin/users/' + userUuid + '/add/organization')
        .send({
          organization: 'blaaaa'
        })
        .set('Accept', 'application/json')
        .expect(404)
    })

    it("should return a 404 if the user isn't found", async function () {
      await test()
        .post('/api/admin/users/blaaa/add/organization')
        .send({
          organization: 'blaaaa'
        })
        .set('Accept', 'application/json')
        .expect(404)
    })

    it('should add a user to an organzation and return a 200', async function () {
      const organization = await Organization.create({ name: 'new organization' })
      const res = await test()
        .post('/api/admin/users/' + userUuid + '/add/organization')
        .send({
          organization: organization.uuid
        })
        .set('Accept', 'application/json')
        .expect(200)

      const newOrg = await Organization.findOne({ 'uuid': organization.uuid }).populate('users')

      expect(res.body.data.organizations[0].uuid).equal(newOrg.uuid)
      expect(newOrg.users[0].uuid).equal(userUuid)
    })
  })

  describe('[post] Remove user from a organization', () => {
    it('should return a 404', async function () {
      await test()
        .get('/api/admin/users/' + userUuid + '/remove/organization')
        .set('Accept', 'application/json')
        .expect(404)
    })

    it("should return a 404 if the organization isn't found", async function () {
      await test()
        .post('/api/admin/users/' + userUuid + '/remove/organization')
        .send({
          organization: 'blaaaa'
        })
        .set('Accept', 'application/json')
        .expect(404)
    })

    it("should return a 404 if the user isn't found", async function () {
      await test()
        .post('/api/admin/users/blaaa/remove/organization')
        .send({
          organization: 'blaaaa'
        })
        .set('Accept', 'application/json')
        .expect(404)
    })

    it('should return a 200', async function () {
      const res = await test()
        .post('/api/admin/users/' + userUuid + '/remove/organization')
        .send({
          organization: orgUuid
        })
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.data.organizations.length).equal(0)
      const newOrg = await Organization.findOne({ 'uuid': orgUuid })
      expect(newOrg.users.length).equal(0)
    })
  })

  describe('[delete] An organization', () => {
    it("should return a 404 if the org isn't found", async function () {
      await test()
        .delete('/api/admin/organizations/blaaaaaa')
        .set('Accept', 'application/json')
        .expect(404)
    })

    it('should return a 200 and set isDeleted to true', async function () {
      await test()
        .delete('/api/admin/organizations/' + orgUuid)
        .set('Accept', 'application/json')
        .expect(200)

      const newOrg = await Organization.findOne({ 'uuid': orgUuid })
      expect(newOrg.isDeleted).equal(true)
    })
  })
})

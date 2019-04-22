/* global describe, before, it */
require('co-mocha')

const { expect } = require('chai')
const http = require('http')
const { clearDatabase } = require('../utils')
const api = require('api/')
const request = require('supertest')
const { Group, User } = require('models')

function test () {
  return request(http.createServer(api.callback()))
}

describe('Group CRUD', () => {
  var groupUuid = ''
  var userUuid = ''

  before(async function () {
    await clearDatabase()
  })

  describe('[post] /Create an group', () => {
    it('should return a 422 if no data is provided', async function () {
      await test()
        .post('/api/admin/groups')
        .set('Accept', 'application/json')
        .expect(422)
    })

    it('should return a 422 if no name is provided', async function () {
      await test()
        .post('/api/admin/groups')
        .send({
          description: 'Una descripción'
        })
        .set('Accept', 'application/json')
        .expect(422)
    })

    it('should return a 200 and the group created', async function () {
      const res = await test()
        .post('/api/admin/groups')
        .send({
          name: 'Un group',
          description: 'Una descripción'
        })
        .set('Accept', 'application/json')
        .expect(200)

      groupUuid = res.body.data.uuid
      const newGroup = await Group.findOne({ 'uuid': groupUuid })
      expect(newGroup.name).equal('Un group')
      expect(newGroup.description).equal('Una descripción')
    })
  })

  describe('[post] /Update an group', () => {
    it('should return a 422 if no data is provided', async function () {
      await test()
        .post('/api/admin/groups/' + groupUuid)
        .set('Accept', 'application/json')
        .expect(422)
    })

    it('should return a 422 if no name is provided', async function () {
      await test()
        .post('/api/admin/groups/' + groupUuid)
        .send({
          description: 'Una descripción'
        })
        .set('Accept', 'application/json')
        .expect(422)
    })

    it("should return a 404 if the group isn't found", async function () {
      await test()
        .post('/api/admin/groups/blaaaaaa')
        .send({
          name: 'Un group',
          description: 'Otra descripción'
        })
        .set('Accept', 'application/json')
        .expect(404)
    })

    it('should return a 200 and the group updated', async function () {
      const baseGroup = await Group.create({
        name: 'Un group',
        description: 'Una descripción'
      })

      await test()
        .post('/api/admin/groups/' + baseGroup.uuid)
        .send({
          name: 'Un group',
          description: 'Otra descripción'
        })
        .set('Accept', 'application/json')
        .expect(200)

      const newGroup = await Group.findOne({ 'uuid': baseGroup.uuid })
      expect(newGroup.name).equal('Un group')
      expect(newGroup.description).equal('Otra descripción')
    })
  })

  describe('[get] A group', () => {
    it("should return a 404 if the group isn't found", async function () {
      await test()
        .get('/api/admin/groups/blaaaaaa')
        .set('Accept', 'application/json')
        .expect(404)
    })

    it('should return a 200 and the group requested', async function () {
      const baseGroup = await Group.create({
        name: 'Un group',
        description: 'Una descripción'
      })

      const res = await test()
        .get('/api/admin/groups/' + baseGroup.uuid)
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.data.name).equal('Un group')
      expect(res.body.data.description).equal('Una descripción')
    })
  })

  describe('[post] Add user to a group', () => {
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
        .get('/api/admin/users/' + userUuid + '/add/group')
        .set('Accept', 'application/json')
        .expect(404)
    })

    it("should return a 404 if the group isn't found", async function () {
      await test()
        .post('/api/admin/users/' + userUuid + '/add/group')
        .send({
          group: 'blaaaa'
        })
        .set('Accept', 'application/json')
        .expect(404)
    })

    it("should return a 404 if the user isn't found", async function () {
      await test()
        .post('/api/admin/users/blaaa/add/group')
        .send({
          group: 'blaaaa'
        })
        .set('Accept', 'application/json')
        .expect(404)
    })

    it('should return a 200', async function () {
      const group = await Group.create({ name: 'new group' })

      const res = await test()
        .post('/api/admin/users/' + userUuid + '/add/group')
        .send({
          group: group.uuid
        })
        .set('Accept', 'application/json')
        .expect(200)

      const newGroup = await Group.findOne({ 'uuid': group.uuid }).populate('users')

      expect(res.body.data.groups[0].uuid).equal(group.uuid)
      expect(newGroup.users[0].uuid).equal(userUuid)
    })
  })

  describe('[post] Remove user from a group', () => {
    it('should return a 404', async function () {
      await test()
        .get('/api/admin/users/' + userUuid + '/remove/group')
        .set('Accept', 'application/json')
        .expect(404)
    })

    it("should return a 404 if the group isn't found", async function () {
      await test()
        .post('/api/admin/users/' + userUuid + '/remove/group')
        .send({
          group: 'blaaaa'
        })
        .set('Accept', 'application/json')
        .expect(404)
    })

    it("should return a 404 if the user isn't found", async function () {
      await test()
        .post('/api/admin/users/blaaa/remove/group')
        .send({
          group: 'blaaaa'
        })
        .set('Accept', 'application/json')
        .expect(404)
    })

    it('should return a 200', async function () {
      const res = await test()
        .post('/api/admin/users/' + userUuid + '/remove/group')
        .send({
          group: groupUuid
        })
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.data.groups.length).equal(0)
      const newGroup = await Group.findOne({ 'uuid': groupUuid })
      expect(newGroup.users.length).equal(0)
    })
  })

  describe('[delete] A group', () => {
    before(async function () {
      await test()
        .post('/api/admin/users/' + userUuid + '/add/group')
        .send({
          group: groupUuid
        })
        .set('Accept', 'application/json')
        .expect(200)
    })

    it("should return a 404 if the group isn't found", async function () {
      await test()
        .delete('/api/admin/groups/blaaaaaa')
        .set('Accept', 'application/json')
        .expect(404)
    })

    it('should return a 200 and set isDeleted to true', async function () {
      await test()
        .delete('/api/admin/groups/' + groupUuid)
        .set('Accept', 'application/json')
        .expect(200)

      const newGroup = await Group.findOne({ 'uuid': groupUuid })
      const newUser = await User.findOne({ 'uuid': userUuid })
      expect(newGroup.isDeleted).equal(true)
      expect(newGroup.users.length).equal(0)
      expect(newUser.groups.length).equal(0)
    })
  })
})

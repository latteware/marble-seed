/* global describe, beforeEach, it */
require('co-mocha')

const { expect } = require('chai')
const http = require('http')
const { clearDatabase, createUser } = require('../utils')
const api = require('api/')
const request = require('supertest')
const { User, UserToken } = require('models')
const lov = require('lov')

function test () {
  return request(http.createServer(api.callback()))
}

describe('/user', () => {
  const password = '1234'

  beforeEach(async function () {
    await clearDatabase()
  })

  describe('[post] / Create user', () => {
    it('should return a error', async function () {
      await test()
        .post('/api/user/')
        .send()
        .set('Accept', 'application/json')
        .expect(422)
    })

    it('should return a 200 with user and jwt', async function () {
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

      expect(res.body.user.email).equal(email)
      expect(res.body.user.uuid).to.have.lengthOf(36)
      expect(typeof res.body.jwt).equal('string')
    })
  })

  describe('[post] /me/update', () => {
    it('should return a error', async function () {
      await test()
        .post('/api/user/me/update')
        .send()
        .set('Accept', 'application/json')
        .expect(422)
    })

    it('should return a 403 if no user data is sent', async function () {
      await test()
        .post('/api/user/me/update')
        .send({
          email: 'app@user.com',
          screenName: 'newNick'
        })
        .set('Accept', 'application/json')
        .expect(403)
    })

    it('should return a 200', async function () {
      const user = await createUser({ password })
      const token = await user.createToken({ type: 'session' })
      const jwt = token.getJwt()

      const res = await test()
        .post('/api/user/me/update')
        .send({
          email: 'app@user.com',
          screenName: 'newNick',
          uuid: user.uuid
        })
        .set('Authorization', `Bearer ${jwt}`)
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.user.uuid).equal(user.uuid)
    })
  })

  describe('[post] /me/update-password', () => {
    it('should return a error', async function () {
      await test()
        .post('/api/user/me/update-password')
        .send()
        .set('Accept', 'application/json')
        .expect(422)
    })

    it('should return a 403 if no user data is send', async function () {
      const newPassword = '123'

      await test()
        .post('/api/user/me/update-password')
        .send({
          password: password,
          newPassword: newPassword,
          confirmPassword: newPassword
        })
        .set('Accept', 'application/json')
        .expect(403)
    })

    it('should return a 200', async function () {
      const user = await createUser({ password })
      const token = await user.createToken({ type: 'session' })
      const jwt = token.getJwt()
      const newPassword = '123'

      const res = await test()
        .post('/api/user/me/update-password')
        .send({
          password: password,
          newPassword: newPassword,
          confirmPassword: newPassword
        })
        .set('Authorization', `Bearer ${jwt}`)
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.user.uuid).equal(user.uuid)

      const updatedUser = await User.findOne({ uuid: user.uuid })
      expect(await updatedUser.validatePassword(newPassword)).equal(true)
    })
  })

  describe('[post] /login', () => {
    it('should return a error', async function () {
      const user = await createUser({ password })

      await test()
        .post('/api/user/login')
        .send({ password: '4321', email: user.email })
        .set('Accept', 'application/json')
        .expect(401)
    })

    it('should create a session', async function () {
      const user = await createUser({ password })

      const res = await test()
        .post('/api/user/login')
        .set('Accept', 'application/json')
        .send({ password, email: user.email })
        .expect(200)

      expect(res.body.user.email).equal(user.email)
    })
  })

  describe('[get] /me gets user data with a jwt token', () => {
    it('should return a 200 with loggedIn false', async function () {
      const res = await test()
        .get('/api/user/me')
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.loggedIn).equal(false)
    })

    it('should return user data', async function () {
      const user = await createUser({ password })
      const token = await user.createToken({ type: 'session' })
      const jwt = token.getJwt()

      const res = await test()
        .get('/api/user/me')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)

      expect(res.body.loggedIn).equal(true)
    })

    it('should return 401 for invalid jwt', async function () {
      await test()
        .get('/api/user/me')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer Invalid`)
        .expect(401)
    })
  })

  describe('[get] /me gets user data with a api token', () => {
    it('should return a 200 with loggedIn false', async function () {
      const res = await test()
        .get('/api/user/me')
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.loggedIn).equal(false)
    })

    it('should return user data', async function () {
      const user = await createUser({ password })
      const token = await user.createToken({ type: 'api' })
      const basicAuth = Buffer.from(token.key + ':' + token.secret).toString('base64')

      const res = await test()
        .get('/api/user/me')
        .set('Accept', 'application/json')
        .set('Authorization', `Basic ${basicAuth}`)
        .expect(200)

      expect(res.body.loggedIn).equal(true)
    })

    it('should return 401 for invalid jwt', async function () {
      await test()
        .get('/api/user/me')
        .set('Accept', 'application/json')
        .set('Authorization', `Basic Invalid`)
        .expect(401)
    })
  })

  describe('[post] /tokens create API tokens', () => {
    it('should return a 403 when no auth is sended', async function () {
      await test()
        .post('/api/user/tokens')
        .send({ name: 'new token' })
        .set('Accept', 'application/json')
        .expect(403)
    })

    it('should return a 403 when basic auth is sended', async function () {
      const user = await createUser({ password })
      const token = await user.createToken({ type: 'api' })
      const basicAuth = Buffer.from(token.key + ':' + token.secret).toString('base64')

      await test()
        .post('/api/user/tokens')
        .send({ name: 'new token' })
        .set('Accept', 'application/json')
        .set('Authorization', `Basic ${basicAuth}`)
        .expect(403)
    })

    it('should return a 200 and token data for Bearer auth', async function () {
      const user = await createUser({ password })
      const token = await user.createToken({ type: 'session' })
      const jwt = token.getJwt()

      const res = await test()
        .post('/api/user/tokens')
        .send({ name: 'new token' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)

      const schema = {
        uuid: lov.string().uuid().required(),
        key: lov.string().uuid().required(),
        secret: lov.string().uuid().required(),
        name: lov.string().required()
      }

      const result = lov.validate(res.body.token, schema)

      expect(res.body.token.name).equal('new token')
      expect(result.error).equal(null)
    })
  })

  describe('[get] /tokens list active APi tokens', () => {
    it('should return a 403 when no auth is sended', async function () {
      await test()
        .get('/api/user/tokens')
        .set('Accept', 'application/json')
        .expect(403)
    })

    it('should return a 403 when basic auth is sended', async function () {
      const user = await createUser({ password })
      const token = await user.createToken({ type: 'api' })
      const basicAuth = Buffer.from(token.key + ':' + token.secret).toString('base64')

      await test()
        .get('/api/user/tokens')
        .set('Accept', 'application/json')
        .set('Authorization', `Basic ${basicAuth}`)
        .expect(403)
    })

    it('should return a 200 and token data for Bearer auth', async function () {
      const user = await createUser({ password })
      const token = await user.createToken({ type: 'session' })
      const jwt = token.getJwt()

      // Create tokens
      await test()
        .post('/api/user/tokens')
        .send({ name: 'new token' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)

      await test()
        .post('/api/user/tokens')
        .send({ name: 'secondary token' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)

      const res = await test()
        .get('/api/user/tokens')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)

      const schema = {
        uuid: lov.string().uuid().required(),
        key: lov.string().uuid().required(),
        name: lov.string().required()
      }

      expect(res.body.tokens.length).equal(2)
      expect(lov.validate(res.body.tokens[0], schema).error).equal(null)
      expect(lov.validate(res.body.tokens[1], schema).error).equal(null)
    })
  })

  describe('[delete] / Revoke current session token', () => {
    it('should return 401 after session token is revoked', async function () {
      const user = await createUser({ password })
      const token = await user.createToken({ type: 'session' })
      const jwt = token.getJwt()

      const res = await test()
        .get('/api/user/me')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)

      expect(res.body.loggedIn).equal(true)

      await test().del('/api/user/')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)

      await test().get('/api/user/me')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(401)
    })

    it('should have one deleted token in the DB', async function () {
      const user = await createUser({ password })
      const token = await user.createToken({ type: 'session' })
      const jwt = token.getJwt()

      const res = await test()
        .get('/api/user/me')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)

      expect(res.body.loggedIn).equal(true)

      expect(await UserToken.count({ isDeleted: { $ne: true } })).equal(1)

      await test().del('/api/user/')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)

      await test().get('/api/user/me')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(401)

      expect(await UserToken.count()).equal(1)
      expect(await UserToken.count({ isDeleted: { $ne: true } })).equal(0)
    })

    it('should return 403 is a api token tries to be revoked this way', async function () {
      const user = await createUser({ password })

      const apiToken = await user.createToken({ type: 'api', name: 'foo' })
      const basicAuth = Buffer.from(apiToken.key + ':' + apiToken.secret).toString('base64')

      await test().del('/api/user/')
        .set('Accept', 'application/json')
        .set('Authorization', `Basic ${basicAuth}`)
        .expect(403)
    })
  })

  describe('[delete] /tokens/:uuid Revoke api token', () => {
    it('should return a 403 when no auth is sended', async function () {
      await test()
        .delete('/api/user/tokens/invalid')
        .set('Accept', 'application/json')
        .expect(403)
    })

    it('should return 200 and {success: true} when deleting with Bearer auth', async function () {
      const user = await createUser({ password })
      const token = await user.createToken({ type: 'session' })
      const jwt = token.getJwt()

      const apiToken = await user.createToken({ type: 'api', name: 'foo' })

      const res = await test()
        .del(`/api/user/tokens/${apiToken.uuid}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)

      expect(res.body.success).equal(true)
    })

    it('should return 200 and {success: true} when deleting current api token', async function () {
      const user = await createUser({ password })
      const apiToken = await user.createToken({ type: 'api', name: 'foo' })
      const basicAuth = Buffer.from(apiToken.key + ':' + apiToken.secret).toString('base64')

      const res = await test()
        .del(`/api/user/tokens/${apiToken.uuid}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Basic ${basicAuth}`)
        .expect(200)

      expect(res.body.success).equal(true)
    })

    it('should return 403 and {success: true} when deleting other api token', async function () {
      const user = await createUser({ password })
      const apiToken = await user.createToken({ type: 'api', name: 'foo' })
      const secondaryToken = await user.createToken({ type: 'api', name: 'bar' })
      const basicAuth = Buffer.from(apiToken.key + ':' + apiToken.secret).toString('base64')

      await test()
        .del(`/api/user/tokens/${secondaryToken.uuid}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Basic ${basicAuth}`)
        .expect(403)
    })

    it('should return be removed from the token list', async function () {
      const user = await createUser({ password })
      const token = await user.createToken({ type: 'session' })
      const jwt = token.getJwt()

      await user.createToken({ type: 'api', name: 'bar' })
      const apiToken = await user.createToken({ type: 'api', name: 'foo' })
      const basicAuth = Buffer.from(apiToken.key + ':' + apiToken.secret).toString('base64')

      const firstRes = await test()
        .get('/api/user/tokens')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)

      expect(firstRes.body.tokens.length).equal(2)

      await test()
        .del(`/api/user/tokens/${apiToken.uuid}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Basic ${basicAuth}`)
        .expect(200)

      const secondRes = await test()
        .get('/api/user/tokens')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)

      expect(secondRes.body.tokens.length).equal(1)
      expect(secondRes.body.tokens[0].name).equal('bar')
    })

    it('should return be removed from the token list', async function () {
      const user = await createUser({ password })

      const apiToken = await user.createToken({ type: 'api', name: 'foo' })
      const basicAuth = Buffer.from(apiToken.key + ':' + apiToken.secret).toString('base64')

      await test()
        .del(`/api/user/tokens/${apiToken.uuid}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Basic ${basicAuth}`)
        .expect(200)

      await test()
        .get('/api/user/me')
        .set('Accept', 'application/json')
        .set('Authorization', `Basic ${basicAuth}`)
        .expect(401)

      expect(await UserToken.count()).equal(1)
      expect(await UserToken.count({ isDeleted: { $ne: true } })).equal(0)
    })
  })
})

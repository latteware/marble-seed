const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const moment = require('moment')

const jwt = require('lib/jwt')

const userTokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String },
  uuid: { type: String, default: v4 },
  key: { type: String, default: v4 },
  secret: { type: String, default: v4 },
  type: { type: String, default: 'generic' },
  validUntil: { type: Date },
  lastUse: { type: Date },
  isDeleted: { type: Boolean },
  dateCreated: { type: Date, default: moment.utc }
}, {
  usePushEach: true
})

userTokenSchema.methods.getJwt = function () {
  return jwt.sign({
    key: this.key,
    secret: this.secret
  })
}

userTokenSchema.methods.toPrivate = function () {
  return {
    name: this.name,
    uuid: this.uuid,
    key: this.key,
    secret: this.secret,
    lastUse: this.lastUse
  }
}

userTokenSchema.methods.toPublic = function () {
  return {
    name: this.name,
    uuid: this.uuid,
    key: this.key,
    lastUse: this.lastUse
  }
}

module.exports = mongoose.model('UserToken', userTokenSchema)

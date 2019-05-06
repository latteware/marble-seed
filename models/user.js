const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const bcrypt = require('bcrypt')
const dataTables = require('mongoose-datatables')
const assert = require('http-assert')

const Mailer = require('lib/mailer')

const SALT_WORK_FACTOR = parseInt(process.env.SALT_WORK_FACTOR)

const userSchema = new Schema({
  name: { type: String },
  password: { type: String },
  email: { type: String, required: true, unique: true, trim: true },
  screenName: { type: String, unique: true, required: true },
  lang: { type: String, default: 'es-MX' },

  validEmail: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },

  organizations: [{ type: Schema.Types.ObjectId, ref: 'Organization' }],
  role: { type: Schema.Types.ObjectId, ref: 'Role' },
  groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],

  uuid: { type: String, default: v4 },
  apiToken: { type: String, default: v4 }
}, {
  usePushEach: true
})

userSchema.pre('save', function (next) {
  if (this.isNew) {
    this.id = this._id.toString()
  }

  if (this.email) {
    this.email = this.email.toLowerCase()
  }

  next()
})

userSchema.pre('save', function (next) {
  if (!this.password || !this.isModified('password')) {
    return next()
  }

  try {
    const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR)
    this.password = bcrypt.hashSync(this.password, salt)
  } catch (err) {
    return next(err)
  }

  return next()
})

// Methods
userSchema.methods.toPublic = function () {
  return {
    uuid: this.uuid,
    screenName: this.screenName,
    lang: this.lang,
    name: this.name,
    email: this.email,
    validEmail: this.validEmail,
    isAdmin: this.isAdmin,
    isDeleted: this.isDeleted
  }
}

userSchema.methods.toAdmin = function () {
  const data = {
    uuid: this.uuid,
    screenName: this.screenName,
    lang: this.lang,
    name: this.name,
    email: this.email,
    isAdmin: this.isAdmin,
    validEmail: this.validEmail,
    organizations: this.organizations,
    groups: this.groups,
    isDeleted: this.isDeleted
  }

  if (this.role && this.role.toAdmin) {
    data.role = this.role.uuid
  }

  return data
}

userSchema.methods.validatePassword = async function (password) {
  const isValid = await new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, compared) =>
      (err ? reject(err) : resolve(compared))
    )
  })

  return isValid
}

userSchema.methods.createToken = async function (options = {}) {
  const UserToken = mongoose.model('UserToken')

  const token = await UserToken.create({
    user: this._id,
    type: options.type,
    name: options.name
  })

  return token
}

// Statics
userSchema.statics.toCoreProperties = function (json) {
  return {
    email: json.email,
    screenName: json.screenName
  }
}

userSchema.statics.auth = async function (email, password) {
  const userEmail = email.toLowerCase()
  const user = await this.findOne({ email: userEmail })
  assert(user, 401, 'Invalid email/password')

  const isValid = await new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, compared) =>
      (err ? reject(err) : resolve(compared))
    )
  })

  assert(isValid, 401, 'Invalid email/password')

  return user
}

userSchema.statics.register = async function (options) {
  const { screenName, email } = options

  const emailTaken = await this.findOne({ email })
  assert(!emailTaken, 422, 'Email already in use')

  const screenTaken = await this.findOne({ screenName })
  assert(!screenTaken, 422, 'Username already taken')

  // create in mongoose
  const createdUser = await this.create(options)

  return createdUser
}

userSchema.statics.validateInvite = async function (email, tokenUuid) {
  const UserToken = mongoose.model('UserToken')

  const token = await UserToken.findOne({
    uuid: tokenUuid,
    type: 'invite-email'
  }).populate('user')
  const userEmail = email.toLowerCase()

  assert(token, 401, 'Invalid token! You should contact the administrator of this page.')
  assert(userEmail === token.user.email, 401, 'Invalid token! You should contact the administrator of this page.')

  return token.user
}

userSchema.statics.validateResetPassword = async function (email, tokenUuid) {
  const UserToken = mongoose.model('UserToken')

  const token = await UserToken.findOne({
    uuid: tokenUuid,
    type: 'reset-email'
  }).populate('user')
  const userEmail = email.toLowerCase()

  assert(token, 401, 'Invalid token! You should contact the administrator of this page.')
  assert(userEmail === token.user.email, 401, 'Invalid token! You should contact the administrator of this page.')

  return token.user
}

userSchema.methods.validatePassword = async function (password) {
  const isValid = await new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, compared) =>
      (err ? reject(err) : resolve(compared))
    )
  })

  return isValid
}

userSchema.methods.sendInviteEmail = async function () {
  const UserToken = mongoose.model('UserToken')

  const token = await UserToken.create({
    user: this._id,
    type: 'invite-email'
  })

  const email = new Mailer('invite')

  const data = this.toJSON()
  data.url = process.env.APP_HOST + '/emails/invite?token=' + token.uuid + '&email=' + encodeURIComponent(this.email)

  await email.format(data)
  await email.send({
    recipient: {
      email: this.email,
      name: this.displayName
    },
    title: 'Invite to Marble Seeds'
  })
}

userSchema.methods.sendResetPasswordEmail = async function (admin) {
  const UserToken = mongoose.model('UserToken')

  const token = await UserToken.create({
    user: this._id,
    type: 'reset-email'
  })

  await this.save()
  let url = process.env.APP_HOST

  if (admin) url = process.env.ADMIN_HOST + process.env.ADMIN_PREFIX

  const email = new Mailer('reset-password')

  const data = this.toJSON()
  data.url = url + '/emails/reset?token=' + token.uuid + '&email=' + encodeURIComponent(this.email)

  await email.format(data)
  await email.send({
    recipient: {
      email: this.email,
      name: this.displayName
    },
    title: 'Reset passsword for Marble Seeds'
  })
}

userSchema.plugin(dataTables, {
  formatters: {
    toAdmin: (user) => user.toAdmin(),
    toPublic: (user) => user.toAdmin()
  }
})

module.exports = mongoose.model('User', userSchema)

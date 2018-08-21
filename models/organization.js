const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const dataTables = require('mongoose-datatables')

const organizationSchema = new Schema({
  name: { type: String },
  description: { type: String },
  slug: { type: String },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  uuid: { type: String, default: v4 },
  isDeleted: { type: Boolean, default: false }
}, {
  timestamps: true,
  usePushEach: true
})

organizationSchema.methods.toPublic = function () {
  return {
    uuid: this.uuid,
    name: this.name,
    description: this.description,
    slug: this.slug,
    dateCreated: this.dateCreated
  }
}

organizationSchema.methods.toAdmin = function () {
  return {
    uuid: this.uuid,
    name: this.name,
    description: this.description,
    slug: this.slug,
    dateCreated: this.dateCreated
  }
}

organizationSchema.plugin(dataTables, {
  formatters: {
    toAdmin: (organization) => organization.toAdmin(),
    toPublic: (organization) => organization.toPublic()
  }
})

module.exports = mongoose.model('Organization', organizationSchema)

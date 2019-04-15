const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const dataTables = require('mongoose-datatables')

const emailSchema = new Schema({
  name: { type: String },
  title: { type: String },
  variables: { type: String, default: '' },
  content: { type: Schema.Types.Mixed },
  uuid: { type: String, default: v4 },
  isDeleted: { type: Boolean, default: false }
}, {
  timestamps: true,
  usePushEach: true
})

emailSchema.methods.toPublic = function () {
  return {
    uuid: this.uuid,
    name: this.name,
    variables: this.variables,
    title: this.title,
    content: this.content
  }
}

emailSchema.methods.toAdmin = function () {
  return {
    uuid: this.uuid,
    name: this.name,
    variables: this.variables,
    title: this.title,
    content: this.content
  }
}

emailSchema.plugin(dataTables, {
  formatters: {
    toAdmin: (email) => email.toAdmin(),
    toPublic: (email) => email.toPublic()
  }
})

module.exports = mongoose.model('Email', emailSchema)

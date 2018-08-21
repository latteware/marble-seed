const mongoose = require('mongoose')
const { Schema } = mongoose
const { v4 } = require('uuid')
const s = require('underscore.string')

const typeOptions = ['boolean', 'number', 'string', 'array', 'object']
const appConfigSchema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed },
  type: { type: String, required: true, enum: typeOptions },
  uuid: { type: String, default: v4 }
}, {
  timestamps: true,
  usePushEach: true
})

appConfigSchema.statics.validateType = function (type) {
  if (typeOptions.indexOf(type) >= 0) {
    return true
  }

  return false
}

appConfigSchema.statics.validateKey = function (key) {
  if (s(key).trim().camelize().value() === key) {
    return true
  }

  return false
}

appConfigSchema.methods.toAdmin = function () {
  return {
    uuid: this.uuid,
    key: this.key,
    value: this.value,
    type: this.type
  }
}

module.exports = mongoose.model('Appconfig', appConfigSchema)

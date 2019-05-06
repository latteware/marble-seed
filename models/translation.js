const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const dataTables = require('mongoose-datatables')

const translationSchema = new Schema({
  id: { type: String },
  lang: { type: String },
  modules: { type: [String] },
  content: { type: String },
  uuid: { type: String, default: v4 },
  isDeleted: { type: Boolean, default: false }
}, {
  timestamps: true
})

translationSchema.methods.toPublic = function () {
  return {
    uuid: this.uuid,
    id: this.id,
    lang: this.lang,
    modules: this.modules,
    content: this.content
  }
}

translationSchema.methods.toAdmin = function () {
  return {
    uuid: this.uuid,
    id: this.id,
    lang: this.lang,
    modules: this.modules,
    content: this.content
  }
}

translationSchema.plugin(dataTables, {
  formatters: {
    toAdmin: (group) => group.toAdmin(),
    toPublic: (group) => group.toPublic()
  }
})

module.exports = mongoose.model('Translation', translationSchema)

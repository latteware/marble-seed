const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const dataTables = require('mongoose-datatables')

const articleSchema = new Schema({
  title: { type: String, required: true },
  tags: {type: Schema.Types.Mixed, default: []},
  category: { type: String },
  description: { type: Schema.Types.Mixed, required: true },
  content: { type: Schema.Types.Mixed },
  links: [{ type: String }],
  status: { type: String },
  isTop: { type: Boolean, default: false },
  uuid: { type: String, default: v4 },
  isDeleted: { type: Boolean, default: false },
  author: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
})

articleSchema.plugin(dataTables)

articleSchema.methods.toAdmin = function () {
  return {
    uuid: this.uuid,
    title: this.title,
    tags: this.tags,
    status: this.status,
    category: this.category,
    description: this.description,
    content: this.content,
    links: this.links,
    isTop: this.isTop,
    createdAt: this.createdAt,
    author: this.author
  }
}

articleSchema.methods.toPublic = function () {
  return {
    uuid: this.uuid,
    title: this.title,
    tags: this.tags,
    status: this.status,
    category: this.category,
    description: this.description,
    content: this.content,
    isTop: this.isTop,
    links: this.links,
    createdAt: this.createdAt,
    author: this.author
  }
}

articleSchema.plugin(dataTables, {
  formatters: {
    toAdmin: (item) => item.toAdmin(),
    toPublic: (item) => item.toPublic()
  }
})

module.exports = mongoose.model('Article', articleSchema)

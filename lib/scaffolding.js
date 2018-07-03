const inquirer = require('inquirer')
const fs = require('fs-extra')
const { spawn } = require('child_process')
const nunjucks = require('nunjucks')
const replace = require('replace')
const s = require('underscore.string')
const _ = require('lodash')

module.exports = {
  createFileFromTemplate: function (dirPath, filePath, templatePath, content) {
    return new Promise(function (resolve, reject) {
      fs.readFile(templatePath, 'utf8', (err, data) => {
        if (err) {
          return reject(err)
        } else {
          const template = nunjucks.compile(data)
          const result = template.render(content)

          fs.ensureDir(dirPath, err => {
            if (!err) {
              fs.writeFile(filePath, result, function (err, data) {
                if (err) {
                  return reject(err)
                } else {
                  spawn('standard', ['--fix', filePath])
                  resolve(data)
                }
              })
            } else {
              reject(err)
            }
          })
        }
      })
    })
  },

  replaceInFile: function (filePath, find, replaceWith) {
    replace({
      regex: find,
      replacement: replaceWith,
      paths: [filePath],
      recursive: false,
      silent: true
    })

    spawn('standard', ['--fix', filePath])
  },

  prompt: function (questions) {
    return new Promise(function (resolve, reject) {
      return inquirer.prompt(questions).then(answers => {
        resolve(answers)
      })
    })
  },

  getModel: function (modelName) {
    const models = require('models')
    modelName = s.capitalize(modelName.toLowerCase())
    var model = {}

    if (models.hasOwnProperty(modelName)) {
      model = models[modelName]
    } else {
      return false
    }

    return model
  },

  getModelProperties: function (model) {
    const properties = _.map(model.schema.paths, function (item, key) {
      return key
    })

    return properties
  },

  getModelSchemaForTemplate: function (model, properties = []) {
    var modelSchema = {
      name: model.modelName.toLowerCase(),
      fields: []
    }

    modelSchema.fields = _.map(model.schema.paths, function (item, key) {
      var pos = 1
      if (properties.length > 0) {
        pos = properties.findIndex(e => {
          return (
          String(e) === String(key)
          )
        })
      }

      if (pos >= 0) {
        const schema = {
          name: key,
          type: item.instance.toLowerCase(),
          isRequired: !!(item.isRequired),
          default: (typeof item.defaultValue === 'string' || item.defaultValue instanceof String) ? item.defaultValue : '',
          isArray: (item.instance === 'Array')
        }

        return schema
      } else {
        return ''
      }
    })
    modelSchema.fields = modelSchema.fields.filter(item => item)

    return modelSchema
  }

}

require('../../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const { Translation } = require('models')
const fs = require('fs-extra')

const task = new Task(async function (argv) {
  let langs = await Translation.find().distinct('lang')
  const translationsPath = './app/translations'
  await fs.ensureDir(translationsPath)
  for (let lang of langs) {
    let translations = await Translation.find({ lang: lang })
    translations = translations.map(t => {
      return {
        id: t.id,
        modules: t.modules,
        content: t.content
      }
    })
    fs.writeFileSync(`${translationsPath}/${lang}.json`, JSON.stringify(translations, null, 2))
  }
  return langs
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}

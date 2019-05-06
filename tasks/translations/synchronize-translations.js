require('../../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const { Translation } = require('models')
const fs = require('fs-extra')

const task = new Task(async function (argv) {
  const translationsPath = './app/translations'

  let langs = []
  await fs.readdirSync(translationsPath).forEach(file => {
    langs.push(file.split('.')[0])
  })

  for (let lang of langs) {
    let data = fs.readFileSync(translationsPath + '/' + lang + '.json')
    let translations = JSON.parse(data.toString())
    for (let t of translations) {
      let translation = await Translation.findOne({ id: t.id, lang: lang })
      if (translation) {
        translation.content = t.content
        translation.modules = t.modules
        await translation.save()
      } else {
        translation = await Translation.create({
          id: t.id,
          modules: t.modules,
          content: t.content,
          lang: lang
        })
      }
    }
  }
  return langs
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}

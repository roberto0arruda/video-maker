const fs = require('fs')
const contentFilePath = './content.json'
const scriptFilePath = './content/after-effects-script.js'
const dailyFilePath = './daily.json'

function save(content) {
  const contentString = JSON.stringify(content)
  return fs.writeFileSync(contentFilePath, contentString)
}

function saveDailyRss(content) {
  const contentString = JSON.stringify(content)
  return fs.writeFileSync(dailyFilePath, contentString)
}

function saveScript(content) {
  const contentString = JSON.stringify(content)
  const scriptString = `var content = ${contentString}`
  return fs.writeFileSync(scriptFilePath, scriptString)
}

function load(file = null) {
  const fileBuffer = fs.readFileSync((file === 'daily') ? dailyFilePath : contentFilePath, 'utf-8')
  const contentJson = JSON.parse(fileBuffer)
  return contentJson
}

module.exports = {
  save,
  saveDailyRss,
  saveScript,
  load
}

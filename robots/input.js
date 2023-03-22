const readline = require('readline-sync')
const rssParser = require('rss-parser')
const imdbScrapper = require('imdb-scrapper')
const state = require('./state.js')

async function robot() {
  const content = {
    maximumSentences: 7
  }

  content.engine = askEngineSearch()
  content.searchTerm = await askAndReturnSearchTerm(content.engine)
  content.prefix = askAndReturnPrefix(content.searchTerm)
  state.save(content)

  function askEngineSearch() {
    const engines = ['Google', 'IMDB', 'Manual']

    const chose = readline.keyInSelect(engines, 'Take a engine search: ')

    return engines[chose]
  }

  async function askAndReturnSearchTerm(engine) {
    switch (engine) {
      case 'Google':
      case 'IMDB':
        return await askAndReturnTrend(engine)
      case 'Manual':
        return readline.question('Type a Wikipedia search term: ')
      default:
        break;
    }
  }

  async function askAndReturnTrend(engine) {
    let trends

    switch (engine) {
      case 'Google':
        trends = await googleTrends()
        break
      case 'IMDB':
        trends = await imdbTrends()
        break
    }

    const selectedTrendIndex = readline.keyInSelect(trends, 'Choose one option: ')
    const selectedTrendText = trends[selectedTrendIndex]

    return selectedTrendText
  }

  function askAndReturnPrefix(searchTerm) {
    const prefixes = ['Who is', 'What is', 'The history of']
    const selectedPrefixIndex = readline.keyInSelect(prefixes, `Choose an option for ${searchTerm}: `)
    const selectedPrefixText = prefixes[selectedPrefixIndex]

    return selectedPrefixText
  }

  async function imdbTrends() {
    const imdb = await imdbScrapper.getTrending(20)

    return imdb.trending.map(item => item.name)
  }

  async function googleTrends() {
    const parser = new rssParser()
    let rss

    try {
      rss = state.load('daily')
      console.log('Load CACHE...')
    } catch (e) {
      console.log('Please Wait...')
      rss = await parser.parseURL('https://trends.google.com/trends/trendingsearches/daily/rss?geo=BR')
      state.saveDailyRss(rss)
    }

    return rss.items.map(item => item.title)
  }
}

module.exports = robot

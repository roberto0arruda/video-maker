const readline = require('readline-sync')
const rssparser = require('rss-parser')
const state = require('./state.js')

async function robot() {
  const content = {
    maximumSentences: 7
  }

  content.searchTerm = await askAndReturnSearchTerm()
  content.prefix = askAndReturnPrefix()
  state.save(content)

  async function askAndReturnSearchTerm() {
    const search = readline.question('Type a Wikipedia search term or G to fetch google trends: ')

    return (search.toUpperCase() === 'G') ? await askAndReturnTrend() : search
  }

  async function askAndReturnTrend() {
    let trends = await googleTrendsRss()
    const selectedTrendIndex = readline.keyInSelect(trends, 'Choose one option: ')
    const selectedTrendText = trends[selectedTrendIndex]

    return selectedTrendText
  }

  function askAndReturnPrefix() {
    const prefixes = ['Who is', 'What is', 'The history of']
    const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ')
    const selectedPrefixText = prefixes[selectedPrefixIndex]

    return selectedPrefixText
  }

  async function googleTrendsRss() {
    const parser = new rssparser()

    let rss = await parser.parseURL('https://trends.google.com/trends/trendingsearches/daily/rss?geo=BR')

    return rss.items.map(item => item.title)
  }
}

module.exports = robot

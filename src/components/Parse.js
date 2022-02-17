const needle = require('needle')
const cheerio = require('cheerio')

class Parse {
  async start() {
    let fdoLinks = await this.getFdoLink()
    let acornsLeagueLink = await this.getAcornsLeague(fdoLinks)
    let nextGameInfo = null
    if (acornsLeagueLink) {
      nextGameInfo = await this.getAcornsNextGameInfo(acornsLeagueLink)
    }

    return nextGameInfo
  }

  async getFdoLink() {
    let result = []
    const fdoUrl = 'https://fdo.dp.ua/'
    let resp = await needle('get', fdoUrl)
    const $ = cheerio.load(resp.body)

    $('#menu-main-menu-1 .menu-item-610')
      .find("a[href*='https']")
      .each((i, item) => {
        result.push($(item).attr('href'))
      })

    return result
  }

  async getAcornsLeague(fdoLinks) {
    let result = null
    for (let fdoLink of fdoLinks) {
      let resp = await needle('get', fdoLink)
      const $ = cheerio.load(resp.body)
      if ($(".sp-league-table:contains('Acorns')").length > 0) {
        result = fdoLink
        break
      }
    }

    return result
  }

  async getAcornsNextGameInfo(link) {
    let result = null
    let resp = await needle('get', link)
    const $ = cheerio.load(resp.body)
    let currentDate = new Date()
    $('.tour_title td').each((i, item) => {
      let gameDateRow = $(item).text().split(',')
      gameDateRow = gameDateRow[0].split('.')
      let gameDate = new Date(
        gameDateRow[1] + '/' + gameDateRow[0] + '/' + gameDateRow[2],
      )
      let diffTime = gameDate - currentDate
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays > 0 && diffDays < 4) {
        $(item)
          .parent()
          .nextUntil('.tour_title')
          .each((i2, gameItem) => {
            if ($(gameItem).find("a[href*='acorns']").length > 0) {
              let homeTeam = $(gameItem)
                .find('.team_left a')
                .text()
                .replace(/\s/g, '')
              let guestTeam = $(gameItem)
                .find('.team_right a')
                .text()
                .replace(/\s/g, '')
              let gameTimeRow = $(gameItem)
                .find('.sp-event-status')
                .text()
                .split(':')
              gameDate.setHours(gameDate.getHours() + gameTimeRow[0])
              result = {
                homeTeam: homeTeam,
                guestTeam: guestTeam,
                time: gameDate,
              }
            }
          })
      }
    })

    return result
  }
}

exports.Parse = Parse

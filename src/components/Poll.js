const {PollModel} = require('~/components/model/PollModel')
const {Parse} = require('~/components/Parse')
const {Message} = require('~/components/providers/telegram/Message')
const {PollTelegram} = require('~/components/providers/telegram/PollTelegram')
const {GameModel} = require('~/components/model/GameModel')
const {PollTypeEnum} = require('~/enum/PollTypeEnum')
const {GamePlayerModel} = require('~/components/model/GamePlayerModel')
const {PlayerModel} = require('~/components/model/PlayerModel')
const {PollGameModel} = require('~/components/model/PollGameModel')
const {Settings} = require('~/components/Settings')

const settings = new Settings()
const message = new Message(settings.getChatId(), settings.getBotToken())
const pollTelegram = new PollTelegram(
  settings.getChatId(),
  settings.getBotToken(),
)
const pollModel = new PollModel()
const parse = new Parse()
const gameModel = new GameModel()
const gamePlayerModel = new GamePlayerModel()
const playerModel = new PlayerModel()
const pollGameModel = new PollGameModel()

class Poll {
  async pollProcess(type) {
    switch (type) {
      case PollTypeEnum.pollTraining:
        await this.createPoll(
          'Треша среда 19.30-21.00',
          ['буду', 'мимо'],
          PollTypeEnum.pollTraining,
        )
        break
      case PollTypeEnum.pollGame:
        let nextGameInfo = await parse.start()
        if (nextGameInfo && nextGameInfo.time.getHours() !== 0) {
          let gameId = await gameModel.save(
            nextGameInfo.homeTeam,
            nextGameInfo.guestTeam,
            new Date(nextGameInfo.time),
            new Date(),
          )
          let pollId = await this.createPoll(
            nextGameInfo.homeTeam +
              ' - ' +
              nextGameInfo.guestTeam +
              '\n' +
              nextGameInfo.time.toLocaleString('ru', {
                timezone: 'Europe/Kiev',
                hour12: false,
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              }),
            ['буду', 'мимо'],
            PollTypeEnum.pollGame,
          )
          await pollGameModel.save(
            pollId,
            gameId,
            PollTypeEnum.pollGame,
            new Date(),
          )
        } else {
          await message.createMessage(
            'На выходных игры нет - все к Шапе на кухню!',
          )
        }
        break
      case PollTypeEnum.pollMoney:
        let currentDate = new Date()
        let pastDate = currentDate.setDate(currentDate.getDate() - 3)
        let lastGame = await gameModel.getLastGameByTime(pastDate, new Date())
        console.log(lastGame)
        if (lastGame) {
          let gamePlayers = await gamePlayerModel.getPlayersByGame(lastGame.id)
          console.log(gamePlayers)
          if (gamePlayers.length > 0) {
            let playerIds = gamePlayers.map((item) => item.playerId)
            console.log(playerIds)
            let playersData = await playerModel.getByIds(playerIds)
            console.log(playersData)
            let playersNick = ' '
            for (let playerData of playersData) {
              if (playerData.nickName) {
                playersNick += `${playerData.nickName} `
              } else {
                playersNick +=
                  '[' +
                  playerData.name +
                  '](tg://user?id="' +
                  playerData.telegramId +
                  '") '
              }
            }
            await message.createMessage(
              `Мужики: ${playersNick}` +
                '\n' +
                `сдаем бабки за игру ${lastGame.homeTeam} - ${lastGame.guestTeam}, если сдал поставь +`,
            )
            let pollId = await this.createPoll(
              `Бабки`,
              ['+', 'я пропустил игру'],
              PollTypeEnum.pollMoney,
            )
            await pollGameModel.save(
              pollId,
              lastGame.id,
              PollTypeEnum.pollMoney,
              new Date(),
            )
          }
        }

        break
    }

    process.exit(0)
  }

  async createPoll(text, options, type) {
    let resultPoll = await pollTelegram.createPoll(text, options, type)

    return await pollModel.save(
      resultPoll.poll.id,
      settings.getChatId(),
      text,
      JSON.stringify(options),
      type,
      new Date(),
    )
  }
}

exports.Poll = Poll

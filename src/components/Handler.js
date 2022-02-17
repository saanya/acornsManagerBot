const {PollTypeEnum} = require('~/enum/PollTypeEnum')
const {PlayerModel} = require('~/components/model/PlayerModel')
const {PollModel} = require('~/components/model/PollModel')
const {GamePlayerModel} = require('~/components/model/GamePlayerModel')
const {GameModel} = require('~/components/model/GameModel')
const {PollGameModel} = require('~/components/model/PollGameModel')

const pollModel = new PollModel()
const playerModel = new PlayerModel()
const gameModel = new GameModel()
const gamePlayerModel = new GamePlayerModel()
const pollGameModel = new PollGameModel()

class Handler {
  async pollHandler(ctx, bot, chatId) {
    let msg = 'Юзер ',
      name = '',
      nickName = ''
    if (ctx.update.poll_answer.user.first_name) {
      name += `${ctx.update.poll_answer.user.first_name}`
    }
    if (ctx.update.poll_answer.user.last_name) {
      name += ` ${ctx.update.poll_answer.user.last_name}`
    }
    if (ctx.update.poll_answer.user.username) {
      nickName += `@${ctx.update.poll_answer.user.username}`
    }
    msg += name + ' ' + nickName
    if (ctx.update.poll_answer.user.id) {
      msg += ` ${ctx.update.poll_answer.user.id}`
    }

    let retractVote = false
    if (ctx.update.poll_answer.option_ids.length === 0) {
      retractVote = true
    }
    if (retractVote) {
      msg += ` отменил голос `
    } else {
      msg += ` проголосовал за ${ctx.update.poll_answer.option_ids[0]}`
    }
    let playerData = await playerModel.getByTelegramId(
      ctx.update.poll_answer.user.id,
    )
    if (!playerData) {
      await playerModel.save(
        ctx.update.poll_answer.user.id,
        nickName,
        name,
        new Date(),
      )
    }

    let pollData = await pollModel.getByPollId(ctx.update.poll_answer.poll_id)
    if (pollData && pollData.type === PollTypeEnum.pollGame) {
      let pollGameData = await pollGameModel.getByPollId(
        pollData.id,
        PollTypeEnum.pollGame,
      )
      let gameData = await gameModel.getById(pollGameData.gameId)
      if (gameData) {
        if (retractVote) {
          await gamePlayerModel.deleteById(gameData.id, playerData.id)
        } else if (ctx.update.poll_answer.option_ids[0] === 0) {
          await gamePlayerModel.save(gameData.id, playerData.id, 0, 0)
        }
      }
    } else if (pollData && pollData.type === PollTypeEnum.pollMoney) {
      let pollGameData = await pollGameModel.getByPollId(
        pollData.id,
        PollTypeEnum.pollMoney,
      )
      let gameData = await gameModel.getById(pollGameData.gameId)
      if (gameData) {
        if (retractVote) {
          await gamePlayerModel.updateByParams(gameData.id, playerData.id, {
            isPaid: 0,
            isMissed: 0,
          })
        } else if (ctx.update.poll_answer.option_ids[0] === 0) {
          msg += '(бабки +)'
          await gamePlayerModel.updateByParams(gameData.id, playerData.id, {
            isPaid: 1,
          })
        } else if (ctx.update.poll_answer.option_ids[0] === 1) {
          msg += '(пропустил игру)'
          await gamePlayerModel.updateByParams(gameData.id, playerData.id, {
            isMissed: 1,
          })
        }
      }
    }
    bot.telegram.sendMessage(chatId, msg)
  }
}

exports.Handler = Handler

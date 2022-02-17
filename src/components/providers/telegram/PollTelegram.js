const {Telegraf} = require('telegraf')

class PollTelegram {
  #chatId = null
  #botToken = null

  constructor(chatId, botToken) {
    this.#chatId = chatId
    this.#botToken = botToken
    if (this.#botToken === undefined) {
      throw new Error('botToken must be provided!')
    }
    if (this.#chatId === undefined) {
      throw new Error('chatId must be provided!')
    }
  }

  async createPoll(text, options) {
    const bot = new Telegraf(this.#botToken)
    return await bot.telegram.sendPoll(this.#chatId, text, options, {
      is_anonymous: false,
    })
  }
}

exports.PollTelegram = PollTelegram

const {Telegraf} = require('telegraf')

class Message {
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

  async createMessage(text) {
    const bot = new Telegraf(this.#botToken)
    await bot.telegram.sendMessage(this.#chatId, text)
  }

  async audioMessage() {
    const bot = new Telegraf(this.#botToken)
    await bot.telegram.sendAudio(
      this.#chatId,
      'https://cdn-static.grattis.ru/cards/3923.mp3',
    )
  }
}

exports.Message = Message

const {telegram} = require('~/configs/telegram')

class Settings {
  #chatId = null
  #botToken = null

  constructor() {
    this.#chatId =
      process.env.NODE_ENV === 'development'
        ? telegram.testChatId
        : telegram.chatId
    this.#botToken = telegram.botToken
  }

  getChatId() {
    return this.#chatId
  }

  getBotToken() {
    return this.#botToken
  }
}

exports.Settings = Settings

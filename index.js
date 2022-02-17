require('module-alias/register')
require('dotenv').config()

const {Telegraf} = require('telegraf')
const {Handler} = require('~/components/Handler')
const {Settings} = require('~/components/Settings')

const handler = new Handler()
const settings = new Settings()
const bot = new Telegraf(settings.getBotToken())
bot.on('poll_answer', async (ctx) => {
  try {
    await handler.pollHandler(ctx, bot, settings.getChatId())
  } catch (error) {
    console.log(error)
  }
})
bot.launch().then(() => console.log('Bot Started!'))

require('module-alias/register')
require('dotenv').config()
const {Poll} = require('~/components/Poll')
const {Message} = require('~/components/providers/telegram/Message')
const {Settings} = require('~/components/Settings')

const settings = new Settings()
const poll = new Poll()
const message = new Message(settings.getChatId(), settings.getBotToken())
const actType = process.argv.slice(2)[0] || 'poll'
const type = process.argv.slice(3)[0] || 'training'

createAudio = async (type) => {
  let result = false
  switch (type) {
    case 'audio':
      result = await message.audioMessage()
      break
  }
  console.log(result)
  process.exit(0)
}

switch (actType) {
  case 'poll':
    poll.pollProcess(type)
    break
  case 'message':
    createAudio(type)
    break
  default:
    console.info('Done.')
    process.exit(0)
}

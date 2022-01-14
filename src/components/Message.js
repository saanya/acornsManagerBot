const { Telegraf } = require("telegraf");

class Message {
  async createMessage(text) {
    const token = process.env.NODE_BOT_TOKEN;
    let chatId = process.env.NODE_CHAT_ACORNS_ID;
    if (process.env.NODE_ENV === "development") {
      chatId = process.env.NODE_CHAT_TEST_ID;
    }

    if (token === undefined) {
      throw new Error("NODE_BOT_TOKEN must be provided!");
    }
    if (chatId === undefined) {
      throw new Error("chatId must be provided!");
    }
    const bot = new Telegraf(token);
    await bot.telegram.sendMessage(chatId, text);
  }
}

exports.Message = Message;

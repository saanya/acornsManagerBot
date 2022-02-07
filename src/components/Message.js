const { Telegraf } = require("telegraf");
const fetch = require("node-fetch");

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

  async audioMessage() {
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
    await bot.telegram.sendAudio(
      chatId,
      "https://cdn-static.grattis.ru/cards/3923.mp3"
    );
  }
}

exports.Message = Message;

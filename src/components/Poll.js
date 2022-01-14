const { Telegraf } = require("telegraf");

class Poll {
  async createPoll(text, options) {
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
    await bot.telegram.sendPoll(chatId, text, options, {
      is_anonymous: false,
    });
  }
}

exports.Poll = Poll;

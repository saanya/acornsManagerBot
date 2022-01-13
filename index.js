require("module-alias/register");
require("dotenv").config();

const { Telegraf } = require("telegraf");
const token = process.env.NODE_BOT_TOKEN;
if (token === undefined) {
  throw new Error("NODE_BOT_TOKEN must be provided!");
}
const bot = new Telegraf(token);
const chatId = process.env.NODE_CHAT_TEST_ID;
bot.on("poll_answer", (ctx) => {
  if (ctx.update.poll_answer.option_ids.length === 0) {
    bot.telegram.sendMessage(
      chatId,
      `User @${ctx.update.poll_answer.user.username} retract vote `
    );
    bot.telegram.messa;
  } else {
    bot.telegram.sendMessage(
      chatId,
      `User @${ctx.update.poll_answer.user.username} answer ${ctx.update.poll_answer.option_ids[0]}`
    );
  }
});
bot.launch().then(() => console.log("Bot Started!"));

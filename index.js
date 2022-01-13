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
  let msg = `User ${ctx.update.poll_answer.user.first_name} ${ctx.update.poll_answer.user.last_name}, id: ${ctx.update.poll_answer.user.id}`;
  if (ctx.update.poll_answer.user.username) {
    msg += ` @${ctx.update.poll_answer.user.username}`;
  }

  if (ctx.update.poll_answer.option_ids.length === 0) {
    msg += ` retract vote `;
  } else {
    msg += ` vote ${ctx.update.poll_answer.option_ids[0]}`;
  }
  bot.telegram.sendMessage(chatId, msg);
});
bot.launch().then(() => console.log("Bot Started!"));

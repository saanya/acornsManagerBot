require("module-alias/register");
require("dotenv").config();

const { Telegraf } = require("telegraf");
const token = process.env.NODE_BOT_TOKEN;
if (token === undefined) {
  throw new Error("NODE_BOT_TOKEN must be provided!");
}
const bot = new Telegraf(token);
bot.start((ctx) => ctx.reply("Welcome"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.command("poll", async (ctx) => {
  console.log("poll");
  return ctx.replyWithPoll(
    "Your favorite math constant",
    ["x", "e", "π", "φ", "γ"],
    { is_anonymous: false }
  );
});
bot.telegram.sendPoll(-685222374, "Треша ", ["буду", "не буду"], {
  is_anonymous: false,
});
bot.on("poll_answer", (ctx) => {
  bot.telegram.sendMessage(
    -685222374,
    `User @${ctx.update.poll_answer.user.username} answer ${ctx.update.poll_answer.option_ids[0]}`
  );
});
bot.launch().then(() => console.log("Bot Started!"));

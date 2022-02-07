require("module-alias/register");
require("dotenv").config();

const { Poll } = require("~/components/Poll");
const { Parse } = require("~/components/Parse");
const { Message } = require("~/components/Message");

const poll = new Poll();
const parse = new Parse();
const message = new Message();
const actType = process.argv.slice(2)[0] || "poll";
const type = process.argv.slice(3)[0] || "training";

const createPoll = async (type) => {
  let result = false;
  switch (type) {
    case "training":
      result = await poll.createPoll("Треша среда 19.30-21.00", [
        "буду",
        "мимо",
      ]);
      break;
    case "game":
      let nextGameInfo = await parse.start();
      if (nextGameInfo && nextGameInfo.time.getHours() !== 0) {
        result = await poll.createPoll(
          nextGameInfo.homeTeam +
            " - " +
            nextGameInfo.guestTeam +
            "\n" +
            nextGameInfo.time.toLocaleString("ru", {
              timezone: "Europe/Kiev",
              hour12: false,
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            }),
          ["буду", "мимо"]
        );
      } else {
        result = await message.createMessage(
          "На выходных игры нет - все к Шапе на кухню!"
        );
      }
      break;
  }

  console.log(result);
  process.exit(0);
};

createAudio = async (type) => {
  let result = false;
  switch (type) {
    case "audio":
      result = await message.audioMessage();
      break;
  }
  console.log(result);
  process.exit(0);
};

switch (actType) {
  case "poll":
    createPoll(type);
    break;
  case "message":
    createAudio(type);
    break;
  default:
    console.info("Done.");
    process.exit(0);
}

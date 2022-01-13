require("module-alias/register");
require("dotenv").config();

const { Poll } = require("~/components/Poll");

const poll = new Poll();
const actType = process.argv.slice(2)[0] || "poll";
const type = process.argv.slice(3)[0] || "training";

const createPoll = async (type) => {
  let result = false;
  switch (type) {
    case "training":
      result = await poll.createTraining();
      break;
    case "game":
      console.log("add game");
      break;
  }

  console.log(result);
  process.exit(0);
};

switch (actType) {
  case "poll":
    createPoll(type);
    break;
  default:
    console.info("Done.");
    process.exit(0);
}

const { postMessage } = require("../src/slack-api");
const buildMessage = require("../src/build-message");

(async () => {
  if (
    !process.env.BOT_USER_OAUTH_ACCESS_TOKEN ||
    !process.env.CHANNEL ||
    !process.env.TEXT
  ) {
    console.error("Missing env values");
    return;
  }

  const message = buildMessage(process.env.CHANNEL, process.env.TEXT, {
    as_user: false,
    icon_emoji: ":fire:",
  });
  const result = await postMessage(
    process.env.BOT_USER_OAUTH_ACCESS_TOKEN,
    message
  );

  console.log("result", result);
})();

const {
  apiPostMessage,
  apiAddReaction,
} = require("../src/integration/slack-api");
const buildMessage = require("../src/message/build-message");
const buildReaction = require("../src/reaction/build-reaction");

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
  const result1 = await apiPostMessage(
    process.env.BOT_USER_OAUTH_ACCESS_TOKEN,
    message
  );
  console.log("result1", result1);

  const reaction = buildReaction(
    process.env.CHANNEL,
    "thumbsup",
    result1.response.message.ts
  );
  const result2 = await apiAddReaction(
    process.env.BOT_USER_OAUTH_ACCESS_TOKEN,
    reaction
  );

  console.log("result2", result2);
})();

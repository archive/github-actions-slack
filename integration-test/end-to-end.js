const assert = require("assert");

const {
  apiPostMessage,
  apiAddReaction,
  apiUpdateMessage,
} = require("../src/integration/slack-api");
const buildMessage = require("../src/message/build-message");
const buildReaction = require("../src/reaction/build-reaction");
const buildUpdateMessage = require("../src/update-message/build-update-message");

const testSendMessage = async (channel, token, text, optional = {}) => {
  const message = buildMessage(channel, text, {
    as_user: false,
    icon_emoji: ":fire:",
    ...optional,
  });
  const result = await apiPostMessage(token, message);
  assert.strictEqual(result.statusCode, 200);

  return result;
};

const testSendReaction = async (channel, token) => {
  const message = buildMessage(channel, "Test 2 - testSendReaction 🤓", {
    as_user: false,
    icon_emoji: ":fire:",
  });
  const messageToReactTo = await apiPostMessage(token, message);

  const reaction = buildReaction(
    process.env.CHANNEL,
    "thumbsup",
    messageToReactTo.response.message.ts
  );
  const result = await apiAddReaction(token, reaction);
  assert.strictEqual(result.statusCode, 200);

  return result;
};

const testSendThread = async (channel, token) => {
  const messageToThreadTo = await testSendMessage(
    channel,
    token,
    "Test 3 - testSendThread"
  );

  const result = await testSendMessage(
    channel,
    token,
    "Test 3 - Reply testSendThread",
    { thread_ts: messageToThreadTo.response.message.ts }
  );
  assert.strictEqual(result.statusCode, 200);

  return result;
};

const testUpdateMessage = async (channel, token) => {
  const messageToUpdate = await testSendMessage(
    channel,
    token,
    "Test 4 - testUpdateMessage"
  );

  const message = buildUpdateMessage(
    process.env.CHANNEL,
    "Test 4 - testUpdateMessage - Updated!",
    messageToUpdate.response.message.ts
  );

  const result = await apiUpdateMessage(token, message);
  assert.strictEqual(result.statusCode, 200);

  return result;
};

(async () => {
  if (!process.env.BOT_USER_OAUTH_ACCESS_TOKEN || !process.env.CHANNEL) {
    console.error("Missing env values");
    return;
  }

  console.log("Running Tests");

  await testSendMessage(
    process.env.CHANNEL,
    process.env.BOT_USER_OAUTH_ACCESS_TOKEN,
    "Test 1 - testSendMessage"
  );

  /*await testSendReaction(
    process.env.CHANNEL,
    process.env.BOT_USER_OAUTH_ACCESS_TOKEN
  );

  await testSendThread(
    process.env.CHANNEL,
    process.env.BOT_USER_OAUTH_ACCESS_TOKEN
  );

  await testUpdateMessage(
    process.env.CHANNEL,
    process.env.BOT_USER_OAUTH_ACCESS_TOKEN
  );*/
})();

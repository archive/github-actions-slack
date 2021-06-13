const context = require("../context");
const { apiAddReaction } = require("../integration/slack-api");
const buildMessage = require("./build-reaction");

const jsonPretty = (data) => JSON.stringify(data, undefined, 2);

const addReaction = async () => {
  try {
    const token = context.getRequired("slack-bot-user-oauth-access-token");
    const channelId = context.getRequired("slack-channel");
    const emojiName = context.getRequired("slack-update-message-text");
    const messageTimestamp = context.getRequired("slack-update-message-ts");

    const payload = buildUpdateMessage(channelId, text, messageTimestamp);
    const result = await apiUpdateMessage(token, payload);

    const resultAsJson = jsonPretty(result);
    context.setOutput("slack-result", resultAsJson);
  } catch (error) {
    context.setFailed(jsonPretty(error));
  }
};

module.exports = { addReaction };

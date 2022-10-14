const context = require("../context");
const { apiUpdateMessage } = require("../integration/slack-api");
const buildUpdateMessage = require("./build-update-message");
const { optional } = require("../util/optional");

const jsonPretty = (data) => JSON.stringify(data, undefined, 2);

const updateMessage = async () => {
  try {
    const token = context.getRequired("slack-bot-user-oauth-access-token");
    const channelId = context.getRequired("slack-channel");
    const ts = context.getRequired("slack-update-message-ts");
    const text = context.getOptional("slack-update-message-text");
    const blocks = context.getOptional("slack-update-message-blocks");

    const payload = buildUpdateMessage(channelId, text, blocks, ts, optional());

    context.debugExtra("Update Message PAYLOAD", payload);
    const result = await apiUpdateMessage(token, payload);
    context.debug("Update Message RESULT", result);

    const resultAsJson = jsonPretty(result);
    context.setOutput("slack-result", resultAsJson);
  } catch (error) {
    context.debug(error);
    context.setFailed(jsonPretty(error));
  }
};

module.exports = { updateMessage };

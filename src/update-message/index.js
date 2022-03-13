const context = require("../context");
const { apiUpdateMessage } = require("../integration/slack-api");
const buildUpdateMessage = require("./build-update-message");

const jsonPretty = (data) => JSON.stringify(data, undefined, 2);

const updateMessage = async () => {
  try {
    const token = context.getRequired("slack-bot-user-oauth-access-token");
    const channelId = context.getRequired("slack-channel");
    const text = context.getRequired("slack-update-message-text");
    const ts = context.getRequired("slack-update-message-ts");

    const payload = buildUpdateMessage(channelId, text, ts);

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

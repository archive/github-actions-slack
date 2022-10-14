const context = require("../context");
const { apiPostMessage } = require("../integration/slack-api");
const buildMessage = require("./build-message");
const core = require("@actions/core");
const { optional } = require("../util/optional");

const jsonPretty = (data) => JSON.stringify(data, undefined, 2);

const postMessage = async () => {
  try {
    const token = context.getRequired("slack-bot-user-oauth-access-token");
    const channels = context.getRequired("slack-channel");
    const text = context.getOptional("slack-text");
    const blocks = context.getOptional("slack-blocks");

    const results = [];
    for (let channel of channels.split(",")) {
      channel = channel.trim();

      const payload = buildMessage(channel, text, blocks, optional());

      context.debug("Post Message PAYLOAD", payload);
      const result = await apiPostMessage(token, payload);
      context.debug("Post Message RESULT", result);

      results.push(result);
    }

    // To not break backward compatibility
    const resultAsJson = jsonPretty(results[0]);
    context.setOutput("slack-result", resultAsJson);

    const resultsAsJson = jsonPretty(results);
    context.setOutput("slack-results", resultsAsJson);
  } catch (error) {
    context.setFailed(jsonPretty(error));
  }
};

module.exports = { postMessage };

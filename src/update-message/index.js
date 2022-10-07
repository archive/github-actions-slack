const context = require("../context");
const { apiUpdateMessage } = require("../integration/slack-api");
const buildUpdateMessage = require("./build-update-message");

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

const optional = () => {
  let opt = {};

  const env = context.getEnv();
  Object.keys(env)
    .filter((key) => !!env[key])
    .filter((key) => key.toUpperCase().startsWith("INPUT_SLACK-OPTIONAL-"))
    .forEach((key) => {
      const slackKey = key.replace("INPUT_SLACK-OPTIONAL-", "").toLowerCase();
      opt[slackKey] = env[key];
    });

  return opt;
};

module.exports = { updateMessage };

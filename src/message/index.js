const context = require("../context");
const { apiPostMessage } = require("../integration/slack-api");
const buildMessage = require("./build-message");
const core = require("@actions/core");

const jsonPretty = (data) => JSON.stringify(data, undefined, 2);

const postMessage = async () => {
  try {
    const token = context.getRequired("slack-bot-user-oauth-access-token");
    const channel = context.getRequired("slack-channel");
    const text = context.getRequired("slack-text");

    const payload = buildMessage(channel, text, optional());
    const result = await apiPostMessage(token, payload);

    const resultAsJson = jsonPretty(result);
    context.setOutput("slack-result", resultAsJson);
  } catch (error) {
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

module.exports = { postMessage };

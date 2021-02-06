const context = require("./context");
const { postMessage } = require("./slack-api");
const buildMessage = require("./build-message");

const invoke = async () => {
  try {
    const token = context.getRequired("slack-bot-user-oauth-access-token");
    const channel = context.getRequired("slack-channel");
    const text = context.getRequired("slack-text");

    const message = buildMessage(channel, text, optional());
    const result = await postMessage(token, message);

    const resultAsJson = stringify(result);

    context.setOutput("slack-result", resultAsJson);
  } catch (error) {
    context.setFailed(stringify(error));
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

const stringify = (data) => JSON.stringify(data, undefined, 2);

module.exports = invoke;

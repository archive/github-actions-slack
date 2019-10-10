const context = require("./context");
const github = require("@actions/github");
const postMessage = require("./post-message");
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
    console.log("github.context.payload", stringify(github.context.payload));
  } catch (error) {
    context.setFailed(stringify(error));
  }
};

const optional = () => {
  let opt = {};

  const env = context.getEnv();
  Object.keys(env)
    .filter(key => key.toUpperCase().startsWith("INPUT_SLACK-OPTIONAL-"))
    .forEach(key => {
      const slackKey = key.replace("INPUT_SLACK-OPTIONAL-", "").toLowerCase();
      opt[slackKey] = env[key];
    });

  return opt;
};

const stringify = data => JSON.stringify(data, undefined, 2);

module.exports = invoke;

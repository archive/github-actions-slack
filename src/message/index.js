const context = require("../context");
const { apiPostMessage } = require("../integration/slack-api");
const buildMessage = require("./build-message");
const core = require("@actions/core");

const jsonPretty = (data) => JSON.stringify(data, undefined, 2);

const postMessage = async () => {
  try {
    const token = context.getRequired("slack-bot-user-oauth-access-token");
    const channels = context.getRequired("slack-channel");
    const text = context.getRequired("slack-text");
    const resultsAsJson = []
    
    for(let channel of channels.split(',')) {
      channel = channel.trim()
      
      const payload = buildMessage(channel, text, optional());

      context.debug("Post Message PAYLOAD", payload);
      const result = await apiPostMessage(token, payload);
      context.debug("Post Message RESULT", result);

      resultsAsJson.push(jsonPretty(result))
    }
    
    context.setOutput("slack-result", resultsAsJson);
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

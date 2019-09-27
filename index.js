const core = require("@actions/core");
const github = require("@actions/github");
const notify = require("./src/notify");

const run = async () => {
  try {
    const token = core.getInput("slack-bot-user-oauth-access-token");
    const channel = core.getInput("slack-channel");
    const text = core.getInput("slack-text");

    const result = await notify(token, channel, text);
    log("result", result);

    const resultAsJson = JSON.stringify(result, undefined, 2);
    log("resultAsJson", resultAsJson);

    core.setOutput("slack-result", resultAsJson);

    log("context", github.context);

    log("payload", github.context.payload);
  } catch (error) {
    core.setFailed(error.message);
  }
};

const log = (name, data) => {
  console.log(name, JSON.stringify(data, undefined, 2));
};

run();

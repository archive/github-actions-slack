const core = require("@actions/core");
const github = require("@actions/github");
const notify = require("./src/notify");

const run = async () => {
  try {
    const token = core.getInput("slack-bot-user-oauth-access-token");
    const channel = core.getInput("slack-channel");
    const text = core.getInput("slack-text");

    const result = await notify(token, channel, text);
    const resultAsJson = JSON.stringify(result, undefined, 2);
    core.setOutput("slack-result", resultAsJson);

    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();

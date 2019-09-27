const buildMessage = require("./build-message");
const postMessage = require("./post-message");

const notify = async (token, channel, text) => {
  const message = buildMessage(channel, text);
  const status = await postMessage(token, message);
  return status;
};

module.exports = notify;

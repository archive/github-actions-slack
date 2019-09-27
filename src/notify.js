const buildMessage = require("./build-message");
const postMessage = require("./post-message");

const notify = async (token, channel, text) => {
  const message = buildMessage(channel, text);
  return await postMessage(token, message);
};

module.exports = notify;

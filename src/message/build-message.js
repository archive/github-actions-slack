const {
  restoreEscapedNewLine,
  restoreEscapedTab,
} = require("../util/escaper.js");

const buildMessage = (channel = "", text = "", blocks = "", optional = {}) => {
  if (!channel) {
    throw new Error("Channel must be set");
  }

  if (text && blocks) {
    throw new Error("Text OR Block must be set");
  }

  const message = {
    channel,
    text,
    blocks,
  };

  if (message.text) {
    message.text = restoreEscapedNewLine(message.text);
    message.text = restoreEscapedTab(message.text);
  }

  Object.keys(optional).forEach((name) => {
    message[name] = optional[name];
  });

  return message;
};

module.exports = buildMessage;

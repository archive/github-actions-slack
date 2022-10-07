const {
  restoreEscapedNewLine,
  restoreEscapedTab,
} = require("../util/escaper.js");

const buildMessage = (channel = "", text = "", blocks = "", ts = "", optional = {}) => {
  const message = {
    channel,
    text,
    ts,
    blocks,
  };

  message.text = restoreEscapedNewLine(message.text);
  message.text = restoreEscapedTab(message.text);

  Object.keys(optional).forEach((name) => {
    message[name] = optional[name];
  });

  return message;
};

module.exports = buildMessage;

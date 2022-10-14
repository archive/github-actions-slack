const {
  restoreEscapedNewLine,
  restoreEscapedTab,
} = require("../util/escaper.js");

const buildMessage = (
  channel = "",
  text = "",
  blocks = "",
  ts = "",
  optional = {}
) => {
  if (!channel || !ts) {
    throw new Error("Channel and/or TS must be set");
  }

  if (text && blocks) {
    throw new Error("Text OR Block must be set");
  }

  let message;
  if (text) {
    message = {
      channel,
      text,
      ts,
    };

    message.text = restoreEscapedNewLine(message.text);
    message.text = restoreEscapedTab(message.text);
  } else {
    message = {
      channel,
      ts,
      blocks,
    };
  }

  Object.keys(optional).forEach((name) => {
    message[name] = optional[name];
  });

  return message;
};

module.exports = buildMessage;

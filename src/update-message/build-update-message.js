const buildMessage = (channel = "", text = "", ts="", optional={}) => {
  const message = {
    channel,
    text,
    ts
  };

  message.text = restoreEscapedNewLine(message.text);
  message.text = restoreEscapedTab(message.text);

  Object.keys(optional).forEach((name) => {
    message[name] = optional[name];
  });

  return message;
};

const restoreEscapedNewLine = (text) =>
  text.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n");

const restoreEscapedTab = (text) => text.replace(/\\t/g, "\t");

module.exports = buildMessage;

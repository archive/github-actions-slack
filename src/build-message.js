const buildMessage = (channel, text, optional = {}) => {
  const message = {
    channel,
    text
  };

  Object.keys(optional).forEach(name => {
    message[name] = optional[name];
  });

  return message;
};

module.exports = buildMessage;

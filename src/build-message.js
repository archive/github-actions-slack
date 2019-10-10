const buildMessage = (channel, text, options) => {
  const message = {
    channel,
    text
  };

  Object.keys(options).forEach(name => {
    message[name] = options[name];
  });

  return message;
};

module.exports = buildMessage;

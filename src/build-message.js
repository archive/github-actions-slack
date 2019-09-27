const buildMessage = (channel, text) => {
  const message = {
    channel,
    text
  };

  return message;
};

module.exports = buildMessage;

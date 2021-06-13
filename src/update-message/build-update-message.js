const buildUpdateMessage = (channelId = "", text = "", ts = "") => {
  const message = {
    channel: channelId,
    text: text,
    ts: ts,
  };

  return message;
};

module.exports = buildUpdateMessage;

const buildUpdateMessage = (
  channelId = "",
  text = "",
  messageTimestamp = ""
) => {
  const message = {
    channel: channelId,
    text: text,
    ts: messageTimestamp,
  };

  return message;
};

module.exports = buildUpdateMessage;

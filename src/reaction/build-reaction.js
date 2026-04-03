const buildReaction = (
  channelId = "",
  emojiName = "",
  messageTimestamp = ""
) => {
  const message = {
    channel: channelId,
    name: emojiName,
    timestamp: messageTimestamp,
  };

  return message;
};

export default buildReaction;

import * as context from "../context.js";
import { apiAddReaction } from "../integration/slack-api.js";
import buildMessage from "./build-reaction.js";

const jsonPretty = (data) => JSON.stringify(data, undefined, 2);

const addReaction = async () => {
  try {
    const token = context.getRequired("slack-bot-user-oauth-access-token");
    const channelId = context.getRequired("slack-channel");
    const emojiName = context.getRequired("slack-emoji-name");
    const messageTimestamp = context.getRequired("slack-message-timestamp");

    const payload = buildMessage(channelId, emojiName, messageTimestamp);

    context.debugExtra("Add Reaction PAYLOAD", payload);
    const result = await apiAddReaction(token, payload);
    context.debugExtra("Add Reaction PAYLOAD", result);

    const resultAsJson = jsonPretty(result);
    context.setOutput("slack-result", resultAsJson);
  } catch (error) {
    context.setFailed(jsonPretty(error));
  }
};

export { addReaction };

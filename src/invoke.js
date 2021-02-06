const context = require("./context");
const { postMessage } = require("./message");
const { addReaction } = require("./reaction");

const jsonPretty = (data) => JSON.stringify(data, undefined, 2);

const invoke = async () => {
  try {
    const func = context.getOptional("slack-function") || "send-message";

    switch (func) {
      case "send-message":
        await postMessage();
        break;
      case "send-reaction":
        await addReaction();
        break;
      default:
        context.setFailed("Unhandled `slack-function`: " + func);
        break;
    }
  } catch (error) {
    context.setFailed("invoke failed:" + error + ":" + jsonPretty(error));
  }
};

module.exports = invoke;

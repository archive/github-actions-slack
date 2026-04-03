import * as context from "./context.js";
import { postMessage } from "./message/index.js";
import { addReaction } from "./reaction/index.js";
import { updateMessage } from "./update-message/index.js";

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
      case "update-message":
        await updateMessage();
        break;
      default:
        context.setFailed("Unhandled `slack-function`: " + func);
        break;
    }
  } catch (error) {
    context.setFailed("invoke failed:" + error + ":" + jsonPretty(error));
  }
};

export default invoke;

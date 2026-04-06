import * as context from "../context.js";
import { apiUploadFile } from "../integration/slack-api.js";
import buildUploadFile from "./build-upload-file.js";

const jsonPretty = (data) => JSON.stringify(data, undefined, 2);

const uploadFile = async () => {
  try {
    const token = context.getRequired("slack-bot-user-oauth-access-token");
    const channel = context.getRequired("slack-channel");
    const filePath = context.getRequired("slack-upload-file-path");
    const filename = context.getOptional("slack-upload-filename");
    const title = context.getOptional("slack-upload-file-title");
    const initialComment = context.getOptional("slack-upload-initial-comment");

    const payload = buildUploadFile(
      channel,
      filePath,
      filename,
      title,
      initialComment
    );

    context.debugExtra("Upload File PAYLOAD", payload);
    const result = await apiUploadFile(token, payload);
    context.debugExtra("Upload File RESULT", result);

    const resultAsJson = jsonPretty(result);
    context.setOutput("slack-result", resultAsJson);
  } catch (error) {
    context.setFailed(jsonPretty(error));
  }
};

export { uploadFile };

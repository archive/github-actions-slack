import fs from "fs";
import path from "path";
import { post, postForm, postBinary } from "./slack-api-post.js";

const hasErrors = (res) => !res || !res.ok;

const buildErrorMessage = (res) => {
  return `Error! ${JSON.stringify(res)} (response)`;
};

const apiPostMessage = async (token, message) => {
  const path = "/api/chat.postMessage";
  const res = await post(token, path, message);

  if (hasErrors(res)) {
    throw buildErrorMessage(res);
  }

  return res;
};

const apiAddReaction = async (token, message) => {
  const path = "/api/reactions.add";
  const res = await post(token, path, message);

  if (hasErrors(res)) {
    throw buildErrorMessage(res);
  }

  return res;
};

const apiUpdateMessage = async (token, message) => {
  const path = "/api/chat.update";
  const res = await post(token, path, message);

  if (hasErrors(res)) {
    throw buildErrorMessage(res);
  }

  return res;
};

const apiUploadFile = async (token, payload) => {
  const fileContent = fs.readFileSync(payload.filePath);
  const filename = payload.filename || path.basename(payload.filePath);

  // Step 1: Get upload URL and file ID (requires form encoding, not JSON)
  const urlRes = await postForm(token, "/api/files.getUploadURLExternal", {
    filename,
    length: fileContent.length,
  });
  if (hasErrors(urlRes)) {
    throw buildErrorMessage(urlRes);
  }

  const { upload_url, file_id } = urlRes.response;

  // Step 2: Upload the file binary to the pre-signed URL
  const uploadRes = await postBinary(upload_url, fileContent);
  if (!uploadRes.ok) {
    throw `Error uploading file content (status ${uploadRes.statusCode})`;
  }

  // Step 3: Complete the upload and share to channel
  const completePayload = {
    files: [{ id: file_id, title: payload.title || filename }],
    channel_id: payload.channel,
  };
  if (payload.initialComment) {
    completePayload.initial_comment = payload.initialComment;
  }

  const result = await post(
    token,
    "/api/files.completeUploadExternal",
    completePayload
  );
  if (hasErrors(result)) {
    throw buildErrorMessage(result);
  }

  return result;
};

export { apiPostMessage, apiAddReaction, apiUpdateMessage, apiUploadFile };

import https from "https";
import * as context from "../context.js";

const getOptions = (token, path) => {
  return {
    hostname: "slack.com",
    port: 443,
    path: path,
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${token}`,
    },
  };
};

const post = (token, path, message) => {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(message);

    context.debugExtra("SLACK POST PAYLOAD", payload);

    const options = getOptions(token, path);

    const req = https.request(options, (res) => {
      const chunks = [];

      res.on("data", (chunk) => {
        chunks.push(chunk);
      });

      res.on("end", () => {
        const result = Buffer.concat(chunks).toString();
        const response = JSON.parse(result);

        let isOk = res.statusCode >= 200 && res.statusCode <= 299;

        // This solves the issue that block updates returns 200
        // but contains ok = false in the response
        if (
          response &&
          response.hasOwnProperty("ok") &&
          response.ok === false
        ) {
          isOk = false;
        }

        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          ok: isOk,
          result: result,
          response: response,
        });
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(payload);
    req.end();
  });
};

// Used for Slack methods that require application/x-www-form-urlencoded (e.g. files.getUploadURLExternal)
const postForm = (token, path, fields) => {
  return new Promise((resolve, reject) => {
    const payload = new URLSearchParams(fields).toString();

    context.debugExtra("SLACK POST FORM PAYLOAD", payload);

    const options = {
      hostname: "slack.com",
      port: 443,
      path: path,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(payload),
        Authorization: `Bearer ${token}`,
      },
    };

    const req = https.request(options, (res) => {
      const chunks = [];

      res.on("data", (chunk) => {
        chunks.push(chunk);
      });

      res.on("end", () => {
        const result = Buffer.concat(chunks).toString();
        const response = JSON.parse(result);

        let isOk = res.statusCode >= 200 && res.statusCode <= 299;

        if (response && response.hasOwnProperty("ok") && response.ok === false) {
          isOk = false;
        }

        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          ok: isOk,
          result: result,
          response: response,
        });
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(payload);
    req.end();
  });
};

// Used for step 2 of the files.getUploadURLExternal flow — posts raw binary
// to the pre-signed upload URL returned by Slack (may be a different hostname).
const postBinary = (uploadUrl, fileContent) => {
  return new Promise((resolve, reject) => {
    const url = new URL(uploadUrl);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": fileContent.length,
      },
    };

    context.debug("SLACK UPLOAD BINARY to " + url.hostname + url.pathname);

    const req = https.request(options, (res) => {
      const chunks = [];

      res.on("data", (chunk) => {
        chunks.push(chunk);
      });

      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          ok: res.statusCode >= 200 && res.statusCode <= 299,
        });
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(fileContent);
    req.end();
  });
};

export { post, postForm, postBinary };

const https = require("https");

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

    const options = getOptions(token, path);

    const req = https.request(options, (res) => {
      const chunks = [];

      res.on("data", (chunk) => {
        chunks.push(chunk);
      });

      res.on("end", () => {
        const result = Buffer.concat(chunks).toString();
        const response = JSON.parse(result);

        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          ok: res.statusCode >= 200 && res.statusCode <= 299,
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

const apiPostMessage = async (token, message) => {
  const path = "/api/chat.postMessage";
  const result = await post(token, path, message);

  if (!result || !result.ok) {
    throw `Error! ${JSON.stringify(response)}`;
  }

  return result;
};

const apiAddReaction = async (token, message) => {
  const path = "/api/reactions.add";
  const result = await post(token, path, message);

  if (!result || !result.ok) {
    throw `Error! ${JSON.stringify(response)}`;
  }

  return result;
};

const apiUpdateMessage = async (token, message) => {
  const path = "/api/chat.update";
  const result = await post(token, path, message);

  if (!result || !result.ok) {
    throw `Error! ${JSON.stringify(response)}`;
  }

  return result;
};

module.exports = { apiPostMessage, apiAddReaction, apiUpdateMessage };

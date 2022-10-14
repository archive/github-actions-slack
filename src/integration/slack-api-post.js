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

        const isOk = res.statusCode >= 200 && res.statusCode <= 299;

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

module.exports = { post };

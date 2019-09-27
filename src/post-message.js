const https = require("https");

const getOptions = token => {
  return {
    hostname: "slack.com",
    port: 443,
    path: "/api/chat.postMessage",
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${token}`
    }
  };
};

const post = (token, message) => {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(message);
    const options = getOptions(token);

    const req = https.request(options, res => {
      const chunks = [];

      res.on("data", chunk => {
        chunks.push(chunk);
      });

      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          result: Buffer.concat(chunks).toString()
        });
      });
    });

    req.on("error", error => {
      reject(error);
    });

    req.write(payload);
    req.end();
  });
};

const postMessage = async (token, message) => {
  const response = await post(token, message);
  console.log("response", response);

  const result = JSON.parse(response.result);

  if (!result.ok || response.statusCode !== 200) {
    console.error("Error!", response.statusCode, response.result);
  }
};

module.exports = postMessage;

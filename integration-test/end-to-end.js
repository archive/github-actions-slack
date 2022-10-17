const assert = require("assert");

const {
  apiPostMessage,
  apiAddReaction,
  apiUpdateMessage,
} = require("../src/integration/slack-api");
const buildMessage = require("../src/message/build-message");
const buildReaction = require("../src/reaction/build-reaction");
const buildUpdateMessage = require("../src/update-message/build-update-message");

const testSendMessage = async (channel, token, text, optional = {}) => {
  const message = buildMessage(channel, text, null, {
    as_user: false,
    icon_emoji: ":fire:",
    ...optional,
  });
  const result = await apiPostMessage(token, message);
  assert.strictEqual(result.statusCode, 200);

  return result;
};

const testSendReaction = async (channel, token) => {
  const message = buildMessage(channel, "Test 2 - testSendReaction 🤓", null, {
    as_user: false,
    icon_emoji: ":fire:",
  });
  const messageToReactTo = await apiPostMessage(token, message);

  const reaction = buildReaction(
    process.env.CHANNEL,
    "thumbsup",
    messageToReactTo.response.message.ts
  );
  const result = await apiAddReaction(token, reaction);
  assert.strictEqual(result.statusCode, 200);

  return result;
};

const testSendThread = async (channel, token) => {
  const messageToThreadTo = await testSendMessage(
    channel,
    token,
    "Test 3 - testSendThread"
  );

  const result = await testSendMessage(
    channel,
    token,
    "Test 3 - Reply testSendThread",
    { thread_ts: messageToThreadTo.response.message.ts }
  );
  assert.strictEqual(result.statusCode, 200);

  return result;
};

const testUpdateMessage = async (channel, token) => {
  const messageToUpdate = await testSendMessage(
    channel,
    token,
    "Test 4 - testUpdateMessage"
  );

  const message = buildUpdateMessage(
    process.env.CHANNEL,
    "Test 4 - testUpdateMessage - Updated!",
    null,
    messageToUpdate.response.message.ts
  );

  const result = await apiUpdateMessage(token, message);
  assert.strictEqual(result.statusCode, 200);

  return result;
};

const testUploadFile = async (channel, token) => {
  // WIP!!!
  // 1. Get this test to work
  // 2. Move the code to the src/ section
  // 3. Add integration test

  return new Promise((resolve, reject) => {
    const https = require("https");
    const fs = require("fs");

    let options = {
      method: "POST",
      hostname: "slack.com",
      path: "/api/files.upload",
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    const req = https.request(options, (res) => {
      let chunks = [];

      res.on("data", (chunk) => {
        chunks.push(chunk);
      });

      res.on("end", (chunk) => {
        let body = Buffer.concat(chunks);
        console.log(body.toString());
      });

      res.on("error", (error) => {
        console.error(error);
      });
    });

    /*let postData = `
    ----------------------------650979185122712208150351
    Content-Disposition: form-data; name="file"; filename="one-does-not-simply.jpg"
    Content-Type: image/jpeg

    ${fs.readFileSync(__dirname + "/one-does-not-simply.jpg").toString("ascii")}
    ----------------------------650979185122712208150351
    Content-Disposition: form-data; name="initial_comment"

    Wisdom of the Masters
    ----------------------------650979185122712208150351
    Content-Disposition: form-data; name="channels"

    CPPUV5KU0
    ----------------------------650979185122712208150351--
    `;

    fs.writeFileSync("temp-ascii.txt", postData);

    req.setHeader(
      "content-type",
      "multipart/form-data; boundary=--------------------------650979185122712208150351"
    );*/

    let postData =
      '------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="file"; filename="one-does-not-simply.jpg"\r\nContent-Type: "image/jpeg"\r\n\r\n' +
      fs.readFileSync(__dirname + "/one-does-not-simply.jpg") +
      '\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="initial_comment"\r\n\r\nWisdom of the Masters\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="channels"\r\n\r\nCPPUV5KU0\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--';

    req.setHeader(
      "content-type",
      "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
    );

    req.write(postData);

    req.end();
  });
};

(async () => {
  if (!process.env.BOT_USER_OAUTH_ACCESS_TOKEN || !process.env.CHANNEL) {
    console.error("Missing env values");
    return;
  }

  console.log("Running Tests");

  await testSendMessage(
    process.env.CHANNEL,
    process.env.BOT_USER_OAUTH_ACCESS_TOKEN,
    "Test 1 - testSendMessage"
  );

  await testSendReaction(
    process.env.CHANNEL,
    process.env.BOT_USER_OAUTH_ACCESS_TOKEN
  );

  await testSendThread(
    process.env.CHANNEL,
    process.env.BOT_USER_OAUTH_ACCESS_TOKEN
  );

  await testUpdateMessage(
    process.env.CHANNEL,
    process.env.BOT_USER_OAUTH_ACCESS_TOKEN
  );

  await testUploadFile(
    process.env.CHANNEL,
    process.env.BOT_USER_OAUTH_ACCESS_TOKEN
  );
})();

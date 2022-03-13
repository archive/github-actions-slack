test("message with required (token, channel and text)", async () => {
  mockSlackArguments({
    "slack-bot-user-oauth-access-token": "some-token",
    "slack-channel": "some-channel",
    "slack-text": "some-text",
  });

  const mockApi = mockIntegrationFns();

  const { postMessage } = require("./index");
  await postMessage();

  const requestPayload = mockApi.getApiPostMessagePayload();

  expect(requestPayload.channel).toBe("some-channel");
  expect(requestPayload.text).toBe("some-text");
});

test("message with optional", async () => {
  mockSlackArguments(
    {
      "slack-bot-user-oauth-access-token": "some-token",
      "slack-channel": "some-channel",
      "slack-text": "some-text",
    },
    {
      "INPUT_SLACK-OPTIONAL-ICON_EMOJI": ":some-emoji:",
      "INPUT_SLACK-OPTIONAL-ICON_URL": "https://",
    }
  );

  const mockApi = mockIntegrationFns();

  const { postMessage } = require("./index");
  await postMessage();

  const requestPayload = mockApi.getApiPostMessagePayload();
  expect(requestPayload.icon_emoji).toBe(":some-emoji:");
  expect(requestPayload.icon_url).toBe("https://");
});

test("message ignore empty optionals", async () => {
  mockSlackArguments(
    {
      "slack-bot-user-oauth-access-token": "some-token",
      "slack-channel": "some-channel",
      "slack-text": "some-text",
    },
    {
      "INPUT_SLACK-OPTIONAL-ICON_EMOJI": "",
      "INPUT_SLACK-OPTIONAL-ICON_URL": "",
    }
  );

  const mockApi = mockIntegrationFns();

  const { postMessage } = require("./index");
  await postMessage();

  const requestPayload = mockApi.getApiPostMessagePayload();
  expect(requestPayload.icon_emoji).not.toBeDefined();
  expect(requestPayload.icon_url).not.toBeDefined();
});

const mockSlackArguments = (mockRequired, mockEnv = []) => {
  jest.mock("../context", () => ({
    getRequired: function (key) {
      return mockRequired[key];
    },
    getOptional: function (key) {
      return mockRequired[key];
    },
    getEnv: function () {
      return mockEnv;
    },
    setOutput: function () {
      //console.debug("Test setOutput: " + arguments);
    },
    setFailed: function (ex) {
      console.error("Test setFailed: " + ex);
    },
    debug: function (ex) {
      //console.debug("Test debug: " + ex);
    },
    debugExtra: function (ex) {
      //console.debug("Test debugExtra: " + ex);
    },
    info: function (ex) {
      //console.info("Test info: " + ex);
    },
    warning: function (ex) {
      console.warn("Test warning: " + ex);
    },
  }));
};

const mockIntegrationFns = () => {
  const mockFns = {
    apiPostMessage: jest.fn(),
    apiAddReaction: jest.fn(),
    apiUpdateMessage: jest.fn(),
  };

  jest.mock("../integration/slack-api", () => mockFns);

  function getApiPostMessagePayload() {
    return mockFns.apiPostMessage.mock.calls[0][1];
  }

  return {
    getApiPostMessagePayload,
  };
};

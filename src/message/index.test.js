import { jest } from "@jest/globals";

test("message with required (token, channel and text)", async () => {
  const mockRequired = {
    "slack-bot-user-oauth-access-token": "some-token",
    "slack-channel": "some-channel",
    "slack-text": "some-text",
  };
  mockSlackArguments(mockRequired);
  const mockApi = mockIntegrationFns();

  const { postMessage } = await import("./index.js");
  await postMessage();

  const requestPayload = mockApi.getApiPostMessagePayload();

  expect(requestPayload.channel).toBe("some-channel");
  expect(requestPayload.text).toBe("some-text");
});

test("message with optional", async () => {
  const mockRequired = {
    "slack-bot-user-oauth-access-token": "some-token",
    "slack-channel": "some-channel",
    "slack-text": "some-text",
  };
  const mockEnv = {
    "INPUT_SLACK-OPTIONAL-ICON_EMOJI": ":some-emoji:",
    "INPUT_SLACK-OPTIONAL-ICON_URL": "https://",
  };
  mockSlackArguments(mockRequired, mockEnv);
  const mockApi = mockIntegrationFns();

  const { postMessage } = await import("./index.js");
  await postMessage();

  const requestPayload = mockApi.getApiPostMessagePayload();
  expect(requestPayload.icon_emoji).toBe(":some-emoji:");
  expect(requestPayload.icon_url).toBe("https://");
});

test("message ignore empty optionals", async () => {
  const mockRequired = {
    "slack-bot-user-oauth-access-token": "some-token",
    "slack-channel": "some-channel",
    "slack-text": "some-text",
  };
  const mockEnv = {
    "INPUT_SLACK-OPTIONAL-ICON_EMOJI": "",
    "INPUT_SLACK-OPTIONAL-ICON_URL": "",
  };
  mockSlackArguments(mockRequired, mockEnv);
  const mockApi = mockIntegrationFns();

  const { postMessage } = await import("./index.js");
  await postMessage();

  const requestPayload = mockApi.getApiPostMessagePayload();
  expect(requestPayload.icon_emoji).not.toBeDefined();
  expect(requestPayload.icon_url).not.toBeDefined();
});

const mockSlackArguments = (mockRequired, mockEnv = []) => {
  jest.unstable_mockModule("../context.js", () => ({
    getRequired: function (key) {
      return mockRequired[key];
    },
    getOptional: function (key) {
      return mockRequired[key];
    },
    getEnv: function () {
      return mockEnv;
    },
    setOutput: function () {},
    setFailed: function (ex) {
      console.error("Test setFailed: " + ex);
    },
    debug: function (ex) {},
    debugExtra: function (ex) {},
    info: function (ex) {},
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

  jest.unstable_mockModule("../integration/slack-api.js", () => mockFns);

  function getApiPostMessagePayload() {
    return mockFns.apiPostMessage.mock.calls[0][1];
  }

  return {
    getApiPostMessagePayload,
  };
};

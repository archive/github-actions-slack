describe("message", () => {
  test("with required (token, channel and text)", () => {
    mockSlackRequiredArguments({
      "slack-bot-user-oauth-access-token": "some-token",
      "slack-channel": "some-channel",
      "slack-text": "some-text",
    });

    const httpsMock = mockHttps();

    const { postMessage } = require("./index");
    postMessage();

    const requestPayload = httpsMock.getRequestPayload();
    expect(requestPayload.channel).toBe("some-channel");
    expect(requestPayload.text).toBe("some-text");
  });

  test("with optional", () => {
    mockSlackOptionalArguments({
      "INPUT_SLACK-OPTIONAL-ICON_EMOJI": ":some-emoji:",
      "INPUT_SLACK-OPTIONAL-ICON_URL": "https://",
    });

    const httpsMock = mockHttps();

    const { postMessage } = require("./index");
    postMessage();

    const requestPayload = httpsMock.getRequestPayload();
    expect(requestPayload.icon_emoji).toBe(":some-emoji:");
    expect(requestPayload.icon_url).toBe("https://");
  });

  test("ignore empty optionals", () => {
    mockSlackOptionalArguments({
      "INPUT_SLACK-OPTIONAL-ICON_EMOJI": "",
      "INPUT_SLACK-OPTIONAL-ICON_URL": "",
    });

    const httpsMock = mockHttps();

    const { postMessage } = require("./index");
    postMessage();

    const requestPayload = httpsMock.getRequestPayload();
    expect(requestPayload.icon_emoji).not.toBeDefined();
    expect(requestPayload.icon_url).not.toBeDefined();
  });

  const mockSlackRequiredArguments = (mockSetup, mockEnv = []) => {
    jest.mock("../context", () => ({
      getRequired: function (key) {
        return mockSetup[key];
      },
      setFailed: function (ex) {
        console.error("Test failed: " + ex);
      },
      setOutput: function () {},
      getEnv: function () {
        return mockEnv;
      },
    }));
  };

  const mockSlackOptionalArguments = (mockEnv) => {
    mockSlackRequiredArguments([], mockEnv);
  };

  const mockHttps = () => {
    const mockRequest = {
      on: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    };

    jest.mock("https", () => ({
      request: jest.fn().mockReturnValue(mockRequest),
    }));

    function getRequestPayload() {
      return JSON.parse(mockRequest.write.mock.calls[0][0]);
    }

    return {
      getRequestPayload,
    };
  };
});

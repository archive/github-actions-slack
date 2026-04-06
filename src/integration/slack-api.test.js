import { jest } from "@jest/globals";

describe("slack api", () => {
  test("fail when slack api wrapper returns ok is false", async () => {
    expect.assertions(1);

    const errorResponse = {
      ok: false,
    };

    jest.unstable_mockModule("./slack-api-post.js", () => ({
      post: function (token, path, message) {
        return errorResponse;
      },
      postForm: function (token, path, fields) {
        return errorResponse;
      },
      postBinary: function (uploadUrl, fileContent) {
        return errorResponse;
      },
    }));

    const slackApi = await import("./slack-api.js");
    try {
      await slackApi.apiUpdateMessage();
    } catch (error) {
      expect(error).toContain("Error!");
    }
  });
});

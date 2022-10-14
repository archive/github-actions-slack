describe("slack api", () => {
  test("fail when slack api wrapper returns ok is false", async () => {
    expect.assertions(1);

    const errorResponse = {
      ok: false,
    };

    jest.mock("./slack-api-post", () => ({
      post: function (token, path, message) {
        return errorResponse;
      },
    }));

    const slackApi = require("./slack-api");
    try {
      await slackApi.apiUpdateMessage();
    } catch (error) {
      expect(error).toContain("Error!");
    }
  });
});

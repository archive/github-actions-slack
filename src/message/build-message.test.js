describe("build message", () => {
  test("with channel and text parameters", () => {
    const buildMessage = require("./build-message");

    const message = buildMessage("channel", "text", null);

    expect(message).toEqual({
      channel: "channel",
      text: "text",
    });
  });

  test("with channel and blocks parameters", () => {
    const buildMessage = require("./build-message");

    const message = buildMessage("channel", null, "blocks");

    expect(message).toEqual({
      channel: "channel",
      blocks: "blocks",
    });
  });

  test("with optional parameters", () => {
    const buildMessage = require("./build-message");

    const message = buildMessage("channel", "text", null, { key: "value" });

    expect(message).toEqual({
      channel: "channel",
      text: "text",
      key: "value",
    });
  });
});

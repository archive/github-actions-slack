describe("build message", () => {
  test("with channel and text parameters", () => {
    const buildMessage = require("./build-message");

    const message = buildMessage("channel", "text", null);

    expect(message).toEqual({
      channel: "channel",
      text: "text",
      blocks: null,
    });
  });

  test("with channel and blocks parameters", () => {
    const buildMessage = require("./build-message");

    const message = buildMessage("channel", null, "blocks");

    expect(message).toEqual({
      channel: "channel",
      text: null,
      blocks: "blocks",
    });
  });

  test("with optional parameters", () => {
    const buildMessage = require("./build-message");

    const message = buildMessage("channel", "text", null, { key: "value" });

    expect(message).toEqual({
      channel: "channel",
      text: "text",
      blocks: null,
      key: "value",
    });
  });
});

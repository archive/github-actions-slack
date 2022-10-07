describe("build message", () => {
  test("with channel and text parameters", () => {
    const buildMessage = require("./build-message");

    const message = buildMessage("channel", "text", "blocks");

    expect(message).toEqual({
      channel: "channel",
      text: "text",
      blocks: "blocks",
    });
  });

  test("with optional parameters", () => {
    const buildMessage = require("./build-message");

    const message = buildMessage("channel", "text", "blocks", { key: "value" });

    expect(message).toEqual({
      channel: "channel",
      text: "text",
      blocks: "blocks",
      key: "value",
    });
  });
});

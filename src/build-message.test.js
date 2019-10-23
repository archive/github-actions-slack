describe("build message", () => {
  test("with channel and text parameters", () => {
    const buildMessage = require("./build-message");

    const message = buildMessage("channel", "text");

    expect(message).toEqual({
      channel: "channel",
      text: "text"
    });
  });

  test("with optional parameters", () => {
    const buildMessage = require("./build-message");

    const message = buildMessage("channel", "text", { key: "value" });

    expect(message).toEqual({
      channel: "channel",
      text: "text",
      key: "value"
    });
  });
});

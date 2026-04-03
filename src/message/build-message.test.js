describe("build message", () => {
  test("with channel and text parameters", async () => {
    const { default: buildMessage } = await import("./build-message.js");

    const message = buildMessage("channel", "text", null);

    expect(message).toEqual({
      channel: "channel",
      text: "text",
    });
  });

  test("with channel and blocks parameters", async () => {
    const { default: buildMessage } = await import("./build-message.js");

    const message = buildMessage("channel", null, "blocks");

    expect(message).toEqual({
      channel: "channel",
      blocks: "blocks",
    });
  });

  test("with optional parameters", async () => {
    const { default: buildMessage } = await import("./build-message.js");

    const message = buildMessage("channel", "text", null, { key: "value" });

    expect(message).toEqual({
      channel: "channel",
      text: "text",
      key: "value",
    });
  });
});

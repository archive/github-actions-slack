describe("build reaction", () => {
  test("with required parameters", async () => {
    const { default: buildReaction } = await import("./build-reaction.js");

    const reaction = buildReaction("C123", "thumbsup", "1612615118.003800");

    expect(reaction).toEqual({
      channel: "C123",
      name: "thumbsup",
      timestamp: "1612615118.003800",
    });
  });
});

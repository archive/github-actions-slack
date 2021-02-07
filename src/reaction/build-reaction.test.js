describe("build reaction", () => {
  test("with required parameters", () => {
    const buildReaction = require("./build-reaction");

    const reaction = buildReaction("C123", "thumbsup", "1612615118.003800");

    expect(reaction).toEqual({
      channel: "C123",
      name: "thumbsup",
      timestamp: "1612615118.003800",
    });
  });
});

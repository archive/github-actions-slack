import { jest } from "@jest/globals";
import fs from "fs";

describe("slack api", () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

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

  test("reject upload when host is not allowlisted", async () => {
    expect.assertions(1);

    jest.unstable_unmockModule("./slack-api-post.js");
    const slackApiPost = await import("./slack-api-post.js");

    expect(() =>
      slackApiPost.validateUploadUrl("https://example.com/upload")
    ).toThrow("Upload host not allowed: example.com");
  });

  test("reject upload when extension is not allowlisted", async () => {
    expect.assertions(1);

    jest.unstable_unmockModule("./slack-api-post.js");
    const slackApi = await import("./slack-api.js");

    expect(() => slackApi.validateUploadFile("C:\\temp\\secret.exe")).toThrow(
      "File type not allowed: .exe"
    );
  });

  test("reject upload when file exceeds size limit", async () => {
    expect.assertions(1);

    jest.spyOn(fs, "statSync").mockReturnValue({
      isFile: () => true,
      size: 10 * 1024 * 1024 + 1,
    });

    jest.unstable_unmockModule("./slack-api-post.js");
    const slackApi = await import("./slack-api.js");

    expect(() =>
      slackApi.validateUploadFile("C:\\temp\\report.txt")
    ).toThrow("File too large");
  });
});

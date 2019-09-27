const notify = require("../src/notify");

(async () => {
  if (
    !process.env.BOT_USER_OAUTH_ACCESS_TOKEN ||
    !process.env.CHANNEL ||
    !process.env.TEXT
  ) {
    console.error("Problems with .env file");
    return;
  }

  console.log(
    await notify(
      process.env.BOT_USER_OAUTH_ACCESS_TOKEN,
      process.env.CHANNEL,
      process.env.TEXT
    )
  );
})();

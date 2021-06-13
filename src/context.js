const core = require("@actions/core");

const getRequired = (name) => core.getInput(name, { required: true });

const getOptional = (name) => core.getInput(name, { required: false });

const getEnv = () => process.env;

const setOutput = (name, value) => core.setOutput(name, value);

const setFailed = (msg) => core.setFailed(msg);

const debug = (msg) => core.debug(msg);

const debugExtra = (name, json) => {
  core.debug("CUSTOM DEBUG " + name);

  const message = JSON.stringify(json, undefined, 2);
  core.debug(message);
};

const info = (msg) => core.info(msg);

const warning = (msg) => core.warning(msg);

module.exports = {
  getRequired,
  getOptional,
  getEnv,
  setOutput,
  setFailed,
  debug,
  debugExtra,
  info,
  warning,
};

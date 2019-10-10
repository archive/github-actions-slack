const core = require("@actions/core");

const getRequired = name => core.getInput(name, { required: true });

const getEnv = () => process.env;

const setOutput = (...args) => core.setOutput(args);

const setFailed = (...args) => core.setFailed(args);

module.exports = {
  getRequired,
  getEnv,
  setOutput,
  setFailed
};

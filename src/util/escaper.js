const restoreEscapedNewLine = (text) =>
  text.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n");

const restoreEscapedTab = (text) => text.replace(/\\t/g, "\t");

module.exports = { restoreEscapedNewLine, restoreEscapedTab };

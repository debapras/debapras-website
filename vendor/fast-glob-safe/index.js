const fs = require("node:fs");

function isDirectory(entry) {
  try {
    return fs.statSync(entry).isDirectory();
  } catch {
    return false;
  }
}

function matchOne(pattern) {
  if (!/[*?[\]{}]/.test(pattern)) {
    return fs.existsSync(pattern) ? [pattern] : [];
  }
  return fs.globSync(pattern);
}

function globSync(pattern, options = {}) {
  const patterns = Array.isArray(pattern) ? pattern : [pattern];
  const matches = patterns.flatMap((item) => matchOne(String(item)));
  return options.onlyDirectories ? matches.filter(isDirectory) : matches;
}

function glob(pattern, options) {
  return Promise.resolve(globSync(pattern, options));
}

module.exports = glob;
module.exports.glob = glob;
module.exports.sync = globSync;
module.exports.globSync = globSync;

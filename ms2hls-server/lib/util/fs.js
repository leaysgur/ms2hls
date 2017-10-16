const { promisify } = require('util');
const fs = require('fs');

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

module.exports = {
  mkdir,
  writeFile,
};

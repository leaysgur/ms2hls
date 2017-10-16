const { promisify } = require('util');
const fs = require('fs');

const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);

module.exports = {
  mkdir,
  readdir,
  writeFile,
};

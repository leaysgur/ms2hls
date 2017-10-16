const { promisify } = require('util');
const fs = require('fs');

const mkdir = promisify(fs.mkdir);

module.exports = {
  mkdir,
};

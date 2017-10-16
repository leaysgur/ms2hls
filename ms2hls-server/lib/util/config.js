const path = require('path');

const serverProtocol = 'http';
const serverHost = process.env.HOST || 'localhost';
const serverPort = process.env.PORT || 9999;

const serverUrl = `${serverProtocol}://${serverHost}:${serverPort}`;

const rootPath = path.join(__dirname, '../..');

module.exports = {
  serverPort,
  serverUrl,
  rootPath,
};

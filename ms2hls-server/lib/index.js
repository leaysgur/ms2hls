const { serverPort, rootPath } = require('./util/config');
const { mkdir } = require('./util/fs');
const server = require('./server');

(async function main() {
  // ensure working dirs
  try {
    await mkdir(`${rootPath}/chunks`);
    await mkdir(`${rootPath}/live`);
  } catch (err) {
    // do nothing for dir already exists
    err;
  }

  const fastify = server();
  fastify.listen(serverPort, err => {
    if (err) { throw err; }
    console.log(`Server listening on ${fastify.server.address().port}`);
  });
}());

process.on('uncaughtException', err => {
  console.error(err);
  process.exit(1);
});

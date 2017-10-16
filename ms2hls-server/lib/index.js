const path = require('path');

const { mkdir } = require('./util/fs');
const server = require('./server');

(async function main() {
  try {
    await mkdir(path.join(__dirname, '..', 'chunks'));
    await mkdir(path.join(__dirname, '..', 'live'));
  } catch (err) {
    // do nothing for dir already exists
    err;
  }

  const fastify = server();
  fastify.listen(process.env.PORT || 9999, err => {
    if (err) { throw err; }

    console.log(`Server listening on ${fastify.server.address().port}`);
  });
}());

process.on('uncaughtException', err => {
  console.error(err);
  process.exit(1);
});

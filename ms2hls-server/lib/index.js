const path = require('path');
const fastify = require('fastify')({
  logger: process.env.NODE_ENV !== 'production',
});

fastify.register(require('fastify-multipart'));
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, '..', 'chunks'),
  prefix: '/live/',
});
fastify.use(require('cors')());

fastify.register(require('./api'), { prefix: '/api' });

fastify.listen(process.env.PORT || 9999, err => {
  if (err) { throw err; }

  console.log(`Server listening on ${fastify.server.address().port}`);
});

process.on('uncaughtException', err => {
  console.error(err);
  process.exit(1);
});

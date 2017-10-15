const fastify = require('fastify')({
  logger: process.env.NODE_ENV !== 'production',
});

fastify.register(require('fastify-multipart'));
fastify.use(require('cors')());

fastify.register(require('./routes'), { prefix: '/api' });

fastify.listen(process.env.PORT || 9999, err => {
  if (err) { throw err; }

  console.log(`Server listening on ${fastify.server.address().port}`);
});

process.on('uncaughtException', err => {
  console.error(err);
  process.exit(1);
});

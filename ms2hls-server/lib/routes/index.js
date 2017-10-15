const chunks = require('./chunks');

module.exports = function(fastify, _opts, next) {
  fastify.get('/initialize', (_request, reply) => {
    reply.code(200).send();
  });

  fastify.post('/chunks', chunks);

  fastify.get('/finalize', (_request, reply) => {
    reply.code(200).send();
  });

  next();
};

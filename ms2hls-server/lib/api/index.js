const initializeRoute = require('./initialize');
const chunksRoute = require('./chunks');

module.exports = function(fastify, _opts, next) {
  fastify.get('/initialize/:liveId', initializeRoute);
  fastify.post('/chunks/:liveId', chunksRoute);

  fastify.get('/finalize/:liveId', (_request, reply) => {
    reply.code(200).send();
  });

  next();
};

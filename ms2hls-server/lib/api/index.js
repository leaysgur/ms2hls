const initializeRoute = require('./initialize');
const chunksRoute = require('./chunks');
const finalizeRoute = require('./finalize');

module.exports = function(fastify, _opts, next) {
  fastify.get('/initialize/:liveId', initializeRoute);
  fastify.post('/chunks/:liveId', chunksRoute);
  fastify.get('/finalize/:liveId', finalizeRoute);

  next();
};

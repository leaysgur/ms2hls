const path = require('path');

module.exports = function() {
  const fastify = require('fastify')({
    logger: process.env.NODE_ENV !== 'production',
  });

  fastify.register(require('fastify-multipart'));
  fastify.register(require('fastify-static'), {
    root: path.join(__dirname, '..', 'live'),
    prefix: '/live/',
  });
  fastify.use(require('cors')());

  fastify.register(require('./api'), { prefix: '/api' });

  return fastify;
};

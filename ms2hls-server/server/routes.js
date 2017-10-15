const path = require('path');
const fs = require('fs');

const pump = require('pump');

module.exports = function(fastify, _opts, next) {
  fastify.get('/initialize', (_request, reply) => {
    reply.code(200).send();
  });

  fastify.get('/finalize', (_request, reply) => {
    reply.code(200).send();
  });

  fastify.post('/chunks', (request, reply) => {
    request.multipart(
      (field, file, filename) => {
        if (field !== 'webm') { return; }

        const fileStream = fs.createWriteStream(path.join(__dirname, '..', 'chunks', filename));
        pump(file, fileStream, err => {
          if (err) { throw err; }
        });
      },
      err => {
        if (err) { throw err; }

        reply.code(200).send();
      }
    );
  });

  next();
};

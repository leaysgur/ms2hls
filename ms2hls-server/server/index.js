const path = require('path');
const fs = require('fs');

const fastify = require('fastify')();
const fastifyMultipart = require('fastify-multipart');
const cors = require('cors');
const pump = require('pump');

fastify.register(fastifyMultipart);
fastify.use(cors());

fastify.post('/api/chunks', (request, reply) => {
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

fastify.listen(process.env.PORT || 9999, err => {
  if (err) { throw err; }

  console.log(`Server listening on ${fastify.server.address().port}`);
});

process.on('uncaughtException', err => {
  console.error(err);
  process.exit(1);
});

const path = require('path');
const fs = require('fs');

const pump = require('pump');

module.exports = function(request, reply) {
  request.multipart(
    (field, file, filename) => {
      if (field !== 'webm') { return; }

      // TODO: fix root path
      const fileStream = fs.createWriteStream(path.join(__dirname, '../..', 'chunks', filename));
      pump(file, fileStream, err => {
        if (err) { throw err; }
      });
    },
    err => {
      if (err) { throw err; }

      reply.code(200).send();
    }
  );
};

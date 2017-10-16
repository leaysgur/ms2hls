const fs = require('fs');

const pump = require('pump');

const { rootPath } = require('../util/config');
const { webm2ts } = require('../util/ffmpeg');

module.exports = function(request, reply) {
  const { liveId } = request.params;

  request.multipart(
    (field, file, filename) => {
      if (field !== 'webm') { return; }

      const inputPath = `${rootPath}/chunks/${liveId}/${filename}`;

      const fileStream = fs.createWriteStream(inputPath);
      pump(file, fileStream, err => {
        if (err) { throw err; }

        // async
        webm2ts(inputPath, liveId, filename);

        reply.code(200).send();
      });
    },
    err => {
      if (err) { throw err; }
    }
  );
};

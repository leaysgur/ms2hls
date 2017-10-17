const fs = require('fs');

const pump = require('pump');

const { rootPath } = require('../util/config');
const { webmToTs, tsToDuration } = require('../util/ffmpeg');
const { tsDuration } = require('../util/state');

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
        webmToTs(inputPath, liveId, filename)
          .then((tsPath) => tsToDuration(tsPath))
          .then(duration => tsDuration.set(parseInt(filename), duration));

        reply.code(200).send();
      });
    },
    err => {
      if (err) { throw err; }
    }
  );
};

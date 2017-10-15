const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const pump = require('pump');
const ffmpeg = require('fluent-ffmpeg');

const unlink = promisify(fs.unlink);

module.exports = function(request, reply) {
  const { liveId } = request.params;

  request.multipart(
    (field, file, filename) => {
      if (field !== 'webm') { return; }

      // TODO: fix root path
      const filePath = path.join(__dirname, '../..', 'chunks', liveId, filename);
      const fileStream = fs.createWriteStream(filePath);
      pump(file, fileStream, err => {
        if (err) { throw err; }

        ffmpeg()
          .input(filePath)
          // TODO: bitrate
          .videoCodec('libx264')
          .audioCodec('libfdk_aac')
          .output(filePath.replace('.webm', '.ts'))
          .on('error', err => { throw err; })
          .on('end', () => {
            unlink(filePath);
          })
          .run();
      });
    },
    err => {
      if (err) { throw err; }

      reply.code(200).send();
    }
  );
};

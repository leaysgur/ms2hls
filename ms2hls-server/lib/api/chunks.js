const path = require('path');
const fs = require('fs');

const pump = require('pump');
const ffmpeg = require('fluent-ffmpeg');

module.exports = function(request, reply) {
  const { liveId } = request.params;

  request.multipart(
    (field, file, filename) => {
      if (field !== 'webm') { return; }

      // TODO: fix root path
      const inputPath = path.join(__dirname, '../..', 'chunks', liveId, filename);
      const outputPath = path.join(__dirname, '../..', 'live', liveId, filename.replace('.webm', '.ts'));

      const fileStream = fs.createWriteStream(inputPath);
      pump(file, fileStream, err => {
        if (err) { throw err; }

        ffmpeg()
          .input(inputPath)
          // TODO: bitrate
          .videoCodec('libx264')
          .audioCodec('libfdk_aac')
          .output(outputPath)
          .on('error', err => { throw err; })
          .run();

        reply.code(200).send();
      });
    },
    err => {
      if (err) { throw err; }
    }
  );
};

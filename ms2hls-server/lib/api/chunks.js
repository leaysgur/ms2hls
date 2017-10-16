const fs = require('fs');

const pump = require('pump');
const ffmpeg = require('fluent-ffmpeg');

const { rootPath } = require('../util/config');

module.exports = function(request, reply) {
  const { liveId } = request.params;

  request.multipart(
    (field, file, filename) => {
      if (field !== 'webm') { return; }

      const inputPath = `${rootPath}/chunks/${liveId}/${filename}`;
      const outputPath = `${rootPath}/live/${liveId}/${filename.replace('.webm', '.ts')}`;

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

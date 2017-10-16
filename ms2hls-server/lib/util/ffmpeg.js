const ffmpeg = require('fluent-ffmpeg');

const { rootPath } = require('./config');

const webm2ts = function(inputPath, liveId, filename) {
  const outputPath = `${rootPath}/live/${liveId}/${filename.replace('.webm', '.ts')}`;

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputPath)
      // TODO: bitrate
      .videoCodec('libx264')
      .audioCodec('libfdk_aac')
      .format('mpegts')
      .output(outputPath)
      .on('error', err => reject(err))
      .on('end', () => resolve())
      .run();
  });
};

const tsDuration = function(inputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        return reject(err);
      }

      resolve(metadata.format.duration);
    });
  });
};

module.exports = {
  webm2ts,
  tsDuration,
};

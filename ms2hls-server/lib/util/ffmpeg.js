const ffmpeg = require('fluent-ffmpeg');

const { rootPath } = require('./config');

const webmToTs = function(inputPath, liveId, filename) {
  const outputPath = `${rootPath}/live/${liveId}/${filename.replace('.webm', '.ts')}`;

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputPath)
      .videoCodec('libx264')
      .audioCodec('libfdk_aac')
      .audioChannels(2)
      .format('mpegts')
      .outputOptions([
        '-mpegts_copyts 1',
      ])
      .output(outputPath)
      .on('error', err => reject(err))
      .on('end', () => resolve(outputPath))
      .run();
  });
};

const tsToDuration = function(inputPath) {
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
  webmToTs,
  tsToDuration,
};

const ffmpeg = require('fluent-ffmpeg');

const { rootPath } = require('./config');

const webm2ts = function(inputPath, liveId, filename) {
  const outputPath = `${rootPath}/live/${liveId}/${filename.replace('.webm', '.ts')}`;

  ffmpeg()
    .input(inputPath)
    // TODO: bitrate
    .videoCodec('libx264')
    .audioCodec('libfdk_aac')
    .format('mpegts')
    .output(outputPath)
    .on('error', err => { throw err; })
    .run();
};

module.exports = {
  webm2ts,
};

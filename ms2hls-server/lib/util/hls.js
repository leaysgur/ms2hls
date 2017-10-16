const { writeFile } = require('./fs');
const { rootPath, serverUrl } = require('./config');

const writePlaylist = function(liveId) {
  // TODO: bandwidth / resolution / another levels...
  const playlist = `
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=1700000,CODECS="avc1.4d001f,mp4a.40.2",RESOLUTION=960x540
${serverUrl}/live/${liveId}/chunklist.m3u8
  `.trim();

  return writeFile(`${rootPath}/live/${liveId}/playlist.m3u8`, playlist);
};

module.exports = {
  writePlaylist,
};

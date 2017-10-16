const { writeFile } = require('./fs');

// TODO: bandwidth / resolution / another levels...
const playlist = `
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=1700000,CODECS="avc1.4d001f,mp4a.40.2",RESOLUTION=960x540
http://localhost:9999/live/chunklist.m3u8
`.trim();

const writePlaylist = function(dest) {
  return writeFile(`${dest}/playlist.m3u8`, playlist);
};

module.exports = {
  writePlaylist,
};

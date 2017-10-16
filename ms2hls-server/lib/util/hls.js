const { writeFile, readdir } = require('./fs');
const { rootPath, serverUrl } = require('./config');

const writePlaylist = function(liveId) {
  // TODO: bandwidth / resolution / another levels...
  const playlist = `
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=1700000,CODECS="avc1.4d001f,mp4a.40.2",RESOLUTION=960x540
${serverUrl}/live/${liveId}/chunklist-1.m3u8
  `.trim();

  return writeFile(`${rootPath}/live/${liveId}/playlist.m3u8`, playlist);
};

const writeChunklist = async function(liveId) {
  // check /chunks, not /live
  const files = await readdir(`${rootPath}/chunks/${liveId}`);
  const sortedFiles = files.sort((a, b) => {
    const aNo = parseInt(a);
    const bNo = parseInt(b);
    return aNo - bNo;
  });

  const chunklist = `
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:4
#EXT-X-MEDIA-SEQUENCE:1
${sortedFiles.map(file => `
#EXTINF:4.0,
${serverUrl}/live/${liveId}/${file.replace('.webm', '.ts')}
`.trim()).join('\n')}
  `.trim();

  return writeFile(`${rootPath}/live/${liveId}/chunklist-1.m3u8`, chunklist);
};

module.exports = {
  writePlaylist,
  writeChunklist,
};

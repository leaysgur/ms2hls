const { writeFile, readdir } = require('./fs');
const { rootPath, serverUrl } = require('./config');
const { tsDuration } = require('./ffmpeg');

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
  // check /chunks beacuse /live/xxx/.ts delayed
  const files = await readdir(`${rootPath}/chunks/${liveId}`);
  const sortedFiles = files
    .sort((a, b) => {
      const aNo = parseInt(a);
      const bNo = parseInt(b);
      return aNo - bNo;
    })
    .map(file => `${serverUrl}/live/${liveId}/${file.replace('.webm', '.ts')}`);

  // but we need to ensure all .ts files exist
  const tsFiles = await readdir(`${rootPath}/live/${liveId}`);
  // 1 for playlist.m3u8
  if (files.length !== tsFiles.length - 1) {
    console.error('.ts is missing, maybe last one.');
  }

  const fileDurations = await Promise.all(sortedFiles.map(file => tsDuration(file)));

  const chunklist = `
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-TARGETDURATION:5
#EXT-X-PLAYLIST-TYPE:VOD
${sortedFiles.map((file, idx) => `
#EXTINF:${fileDurations[idx]},
${file}
`.trim()).join('\n')}
#EXT-X-ENDLIST
  `.trim();

  return writeFile(`${rootPath}/live/${liveId}/chunklist-1.m3u8`, chunklist);
};

module.exports = {
  writePlaylist,
  writeChunklist,
};

const { rootPath } = require('../util/config');
const { writePlaylist } = require('../util/hls');

module.exports = async function(request, reply) {
  const { liveId } = request.params;

  const dirPath = `${rootPath}/live/${liveId}`;
  dirPath;

  // TODO: make .m3u8
  await writePlaylist(dirPath);

  reply.code(200).send();
};

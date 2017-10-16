const { writePlaylist } = require('../util/hls');

module.exports = async function(request, reply) {
  const { liveId } = request.params;

  // TODO: make .m3u8
  await writePlaylist(liveId);

  reply.code(200).send();
};

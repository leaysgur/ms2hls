const { writePlaylist, writeChunklist } = require('../util/hls');

module.exports = async function(request, reply) {
  const { liveId } = request.params;

  await writePlaylist(liveId);
  await writeChunklist(liveId);

  reply.code(200).send();
};

const { writePlaylist } = require('../util/hls');
const { finalizingIds } = require('../util/state');

module.exports = async function(request, reply) {
  const { liveId } = request.params;

  // ignore duplicates
  if (finalizingIds.has(liveId)) {
    return reply.code(200).send();
  }

  finalizingIds.add(liveId);
  await writePlaylist(liveId);

  reply.code(200).send();
};

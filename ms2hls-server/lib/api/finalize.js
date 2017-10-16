const { writePlaylist, writeChunklist } = require('../util/hls');
const { processingIds } = require('../util/state');

module.exports = async function(request, reply) {
  const { liveId } = request.params;

  // ignore duplicates
  if (processingIds.has(liveId)) {
    return reply.code(200).send();
  }

  processingIds.add(liveId);

  await writePlaylist(liveId);
  await writeChunklist(liveId);

  reply.code(200).send();
};

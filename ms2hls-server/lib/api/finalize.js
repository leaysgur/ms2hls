const { writePlaylist, writeChunklist } = require('../util/hls');

module.exports = async function(request, reply) {
  const { liveId } = request.params;

  await writePlaylist(liveId);

  // XXX: wait until last .ts generated
  setTimeout(() => {
    writeChunklist(liveId);
    reply.code(200).send();
  }, 2000);
};

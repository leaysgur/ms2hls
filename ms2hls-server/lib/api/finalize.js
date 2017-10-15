const path = require('path');

module.exports = async function(request, reply) {
  const { liveId } = request.params;

  // TODO: fix root path
  const dirPath = path.join(__dirname, '../..', 'chunks', liveId);
  dirPath;

  // TODO: make .m3u8

  reply.code(200).send();
};

const path = require('path');

module.exports = async function(request, reply) {
  const { liveId } = request.params;

  // TODO: fix root path
  const dirPath = path.join(__dirname, '../..', 'chunks', liveId);
  dirPath;

  reply.code(200).send();
};

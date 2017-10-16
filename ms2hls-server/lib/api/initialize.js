const path = require('path');

const { mkdir } = require('../util/fs');

module.exports = async function(request, reply) {
  const { liveId } = request.params;

  // TODO: fix root path
  await mkdir(path.join(__dirname, '../..', 'chunks', liveId));

  reply.code(200).send();
};

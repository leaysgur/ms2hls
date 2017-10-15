const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const mkdir = promisify(fs.mkdir);

module.exports = async function(request, reply) {
  const { liveId } = request.params;

  await mkdir(path.join(__dirname, '../..', 'chunks', liveId));

  reply.code(200).send();
};

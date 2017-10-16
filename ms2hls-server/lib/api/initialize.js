const rootPath = require('../util/root-path');

const { mkdir } = require('../util/fs');

module.exports = async function(request, reply) {
  const { liveId } = request.params;

  await mkdir(`${rootPath}/chunks/${liveId}`);
  await mkdir(`${rootPath}/live/${liveId}`);

  reply.code(200).send();
};

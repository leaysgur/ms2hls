const { rootPath } = require('../util/config');
const { mkdir } = require('../util/fs');
const { tsDuration } = require('../util/state');

module.exports = async function(request, reply) {
  const { liveId } = request.params;

  await mkdir(`${rootPath}/chunks/${liveId}`);
  await mkdir(`${rootPath}/live/${liveId}`);

  tsDuration.clear();

  reply.code(200).send();
};

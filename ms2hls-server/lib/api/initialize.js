const { rootPath } = require('../util/config');
const { mkdir } = require('../util/fs');
const { durations } = require('../util/state');

module.exports = async function(request, reply) {
  const { liveId } = request.params;

  await mkdir(`${rootPath}/chunks/${liveId}`);
  await mkdir(`${rootPath}/live/${liveId}`);

  durations.clear();

  reply.code(200).send();
};

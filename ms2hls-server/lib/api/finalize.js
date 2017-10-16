const rootPath = require('../util/root-path');

module.exports = async function(request, reply) {
  const { liveId } = request.params;

  const dirPath = `${rootPath}/chunks/${liveId}`;
  dirPath;

  // TODO: make .m3u8

  reply.code(200).send();
};

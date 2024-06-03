const PostHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'post',
  version: '1.0.0',
  register: async (server, {
    postService, foundItemService, locationService, validator,
  }) => {
    const postHandler = new PostHandler(postService, foundItemService, locationService, validator);
    server.route(routes(postHandler));
  },
};

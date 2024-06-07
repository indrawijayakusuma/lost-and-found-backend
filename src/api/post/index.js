const PostHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'post',
  version: '1.0.0',
  register: async (server, {
    postService, foundItemService, locationService, questionService, validator,
  }) => {
    const postHandler = new PostHandler(
      postService,
      foundItemService,
      locationService,
      questionService,
      validator,
    );
    server.route(routes(postHandler));
  },
};

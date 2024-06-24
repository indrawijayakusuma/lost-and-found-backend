const QuestionHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'question',
  version: '1.0.0',
  register: async (server, { questionService }) => {
    const questionHandler = new QuestionHandler(questionService);
    server.route(routes(questionHandler));
  },
};

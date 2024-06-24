const ValidationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'validation',
  version: '1.0.0',
  register: async (server, { validationService, answerService, validator }) => {
    const validationHandler = new ValidationHandler(validationService, answerService, validator);
    server.route(routes(validationHandler));
  },
};

const ValidationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'validation',
  version: '1.0.0',
  register: async (server, { validationService, validation }) => {
    const validationHandler = new ValidationHandler(validationService, validation);
    server.route(routes(validationHandler));
  },
};

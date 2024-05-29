/* eslint-disable max-len */
const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'authentication',
  version: '1.0.0',
  register: async (server, { usersService, tokenManager, validator }) => {
    const authenticationsHandler = new AuthenticationsHandler(usersService, tokenManager, validator);
    server.route(routes(authenticationsHandler));
  },
};

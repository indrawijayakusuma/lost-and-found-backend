const UserHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { service, validator, otpservice }) => {
    const userHandler = new UserHandler(service, validator, otpservice);
    server.route(routes(userHandler));
  },
};

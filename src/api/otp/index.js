const routes = require('./routes');
const OtpHandler = require('./handler');

module.exports = {
  name: 'otp',
  version: '1.0.0',
  register: async (server, { otpService, validator, usersService }) => {
    const otpHandler = new OtpHandler(otpService, validator, usersService);
    server.route(routes(otpHandler));
  },
};

/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsHandler {
  constructor(usersService, tokenManager, validator) {
    this.usersService = usersService;
    this.tokenManager = tokenManager;
    this.validator = validator;
  }

  async loginHandler(request, h) {
    this.validator.validatePostAuthenticationPayload(request.payload);

    const { phone, password } = request.payload;
    const { id, fullname, picture } = await this.usersService.verifyUserCredential(phone, password);

    const accessToken = this.tokenManager.generateAccessToken({ id });
    const refreshToken = this.tokenManager.generateRefreshToken({ id });

    h.state('refreshToken', refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        user: {
          id,
          fullname,
          picture,
        },
      },
    });
    response.code(200);
    return response;
  }

  async refreshTokenHandler(request, h) {
    const { refreshToken } = request.state;
    if (!refreshToken) {
      throw new InvariantError('Refresh token tidak valid');
    }

    const { id } = this.tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this.tokenManager.generateAccessToken({ id });
    return {
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken,
      },
    };
  }

  async logoutHandler(request, h) {
    h.unstate('refreshToken');
    return h.response({
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    });
  }
}

module.exports = AuthenticationsHandler;

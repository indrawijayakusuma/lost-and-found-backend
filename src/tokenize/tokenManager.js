const jwt = require('jsonwebtoken');
const InvariantError = require('../exceptions/InvariantError');

const tokenManager = {
  generateAccessToken: (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' }),
  generateRefreshToken: (payload) => jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '16s' }),

  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      return artifacts;
    } catch (error) {
      throw new InvariantError(error.message);
    }
  },
};

module.exports = tokenManager;
const { OtpPayloadSchema } = require('./schema');

const InvariantError = require('../../exceptions/InvariantError');

const AuthenticationsValidator = {
  validateOtpPayload: (payload) => {
    const validationResult = OtpPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
module.exports = AuthenticationsValidator;

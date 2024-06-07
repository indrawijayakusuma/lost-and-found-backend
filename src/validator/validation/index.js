const InvariantError = require('../../exceptions/InvariantError');
const { postClaimValidation } = require('./schema');

const claimValidation = {
  validatePostClaimPayload: (payload) => {
    const validationResult = postClaimValidation.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = claimValidation;

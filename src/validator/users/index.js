const InvariantError = require('../../exceptions/InvariantError');
const {
  UserPayloadSchema, updateUserPayloadSchema, validateUpdateImageSchema,
  imageHeadersSchema, validateUpdatePasswordPayloadSchema,
} = require('./schema');

const UserValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateUpdateUserPayload: (payload) => {
    const validationResult = updateUserPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateUpdateImagePayload: (headers) => {
    const validationResult = validateUpdateImageSchema.validate(headers);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateImageHeader: (headers) => {
    const validationResult = imageHeadersSchema.validate(headers);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateUpdatePasswordPayload: (headers) => {
    const validationResult = validateUpdatePasswordPayloadSchema.validate(headers);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UserValidator;

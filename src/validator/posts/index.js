const { PostPostPayloadSchema, ImageHeadersSchema } = require('./schema');

const InvariantError = require('../../exceptions/InvariantError');

const PostValidator = {
  validatePostPayload: (payload) => {
    const validationResult = PostPostPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateImageHeader: (headers) => {
    const validationResult = ImageHeadersSchema.validate(headers);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
module.exports = PostValidator;

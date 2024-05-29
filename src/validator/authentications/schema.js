const Joi = require('joi');

const PostAuthenticationPayloadSchema = Joi.object({
  phone: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = {
  PostAuthenticationPayloadSchema,
};

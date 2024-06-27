const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().required(),
});

const updateUserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  fullname: Joi.string().required(),
  email: Joi.string().required(),
});

const validateUpdatePasswordPayloadSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});

const validateUpdateImageSchema = Joi.object({
  image: Joi.required(),
});

const imageHeadersSchema = Joi.object({
  'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp').required(),
}).unknown();

module.exports = {
  UserPayloadSchema,
  updateUserPayloadSchema,
  validateUpdateImageSchema,
  imageHeadersSchema,
  validateUpdatePasswordPayloadSchema,
};

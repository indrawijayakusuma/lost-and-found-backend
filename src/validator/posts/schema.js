const Joi = require('joi');

const PostPostPayloadSchema = Joi.object({
  itemName: Joi.string().required(),
  tipeBarang: Joi.string().required(),
  color: Joi.string().required(),
  secondaryColor: Joi.string().required(),
  date: Joi.string().required(),
  image: Joi.required(),
  labelLocation: Joi.string().required(),
  location: Joi.string().required(),
  address: Joi.string().required(),
  additionalInfo: Joi.string().required(),
});

const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp').required(),
}).unknown();

module.exports = {
  PostPostPayloadSchema, ImageHeadersSchema,
};

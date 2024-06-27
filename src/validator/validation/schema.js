const Joi = require('joi');

const postClaimValidation = Joi.object({
  answer: Joi.array().items(Joi.string()),
  postId: Joi.string().required(),
});

module.exports = {
  postClaimValidation,
};

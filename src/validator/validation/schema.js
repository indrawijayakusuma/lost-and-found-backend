const Joi = require('joi');

const postClaimValidation = Joi.object({
  answer: Joi.array().items(Joi.string()),
  // statusValidation: Joi.string().valid('Diproses', 'Selesai', 'Ditolak').required(),
  postId: Joi.string().required(),
});

module.exports = {
  postClaimValidation,
};

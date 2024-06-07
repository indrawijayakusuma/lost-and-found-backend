const Joi = require('joi');

const postClaimValidation = Joi.object({
  answer: Joi.string().required(),
  statusValidation: Joi.string().valid('berlangsung', 'diproses', 'selesai', 'ditolak').required(),
});

module.exports = {
  postClaimValidation,
};

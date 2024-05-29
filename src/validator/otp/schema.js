const Joi = require('joi');

const OtpPayloadSchema = Joi.object({
  otp: Joi.number().required(),
});

module.exports = {
  OtpPayloadSchema,
};

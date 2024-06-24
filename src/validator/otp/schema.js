const Joi = require('joi');

const OtpPayloadSchema = Joi.object({
  otp: Joi.string().required(),
});

module.exports = {
  OtpPayloadSchema,
};

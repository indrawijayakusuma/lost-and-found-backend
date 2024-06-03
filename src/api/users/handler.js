const twilio = require('../../utlis/twilio');

class UserHandler {
  constructor(service, validator, otpservice) {
    this.service = service;
    this.validator = validator;
    this.otpservice = otpservice;
  }

  async postUserHandler(request, h) {
    this.validator.validateUserPayload(request.payload);
    const { phone } = request.payload;

    await this.service.createUser(request.payload);
    const otp = await this.otpservice.createOtp(phone);
    let convertedPhone;
    if (phone.charAt(0) === '0') {
      convertedPhone = phone.substring(1);
    } else {
      convertedPhone = phone;
    }
    await twilio.messages.create({
      from: 'whatsapp:+14155238886',
      body: `${otp} adalah kode verifikasi anda. Demi keamanan akun anda.`,
      to: `whatsapp:+62${convertedPhone}`,
    });

    const response = h.response({
      status: 'success',
      message: 'OTP telah dikirim',
    });
    response.code(200);
    return response;
  }

  async getUserByIdHandler(request) {
    const { id } = request.params;

    const user = await this.service.getUserById(id);

    return {
      status: 'seccess',
      data: {
        user,
      },
    };
  }
}

module.exports = UserHandler;

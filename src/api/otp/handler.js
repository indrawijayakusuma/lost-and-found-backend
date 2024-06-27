const twilio = require('../../utlis/twilio');

class OtpHandler {
  constructor(otpService, validator, userService) {
    this.otpService = otpService;
    this.validator = validator;
    this.userService = userService;
  }

  async VerifyOtpHandler(request, h) {
    this.validator.validateOtpRegisterPayload(request.payload);

    const phone = await this.otpService.verifyOtp(request.payload.otp);
    await this.userService.verifyUser(phone);

    const response = h.response({
      status: 'success',
      message: 'Berhasil mendaftarkan akun',
    });
    response.code(200);
    return response;
  }

  async createTokenHandler(request, h) {
    const { phone } = request.payload;
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

  async verifyOtpHandler(request, h) {
    this.validator.validateOtpRegisterPayload(request.payload);
    await this.otpService.verifyOtp(request.payload.otp);

    const response = h.response({
      status: 'success',
      message: 'Berhasil mendaftarkan akun',
    });
    response.code(200);
    return response;
  }

  async getOtpByPhoneAndOtpCodeHandler(request, h) {
    const { phone, otp } = request.query;
    const otpData = await this.otpService.getOtpByPhoneAndOtpCode(phone, otp);
    const response = h.response({
      status: 'success',
      data: otpData,
    });
    response.code(200);
    return response;
  }
}

module.exports = OtpHandler;

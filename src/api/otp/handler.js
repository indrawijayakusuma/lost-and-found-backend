class OtpHandler {
  constructor(otpService, validator, userService) {
    this.otpService = otpService;
    this.validator = validator;
    this.userService = userService;
  }

  async VerifyOtpHandler(request, h) {
    this.validator.validateOtpPayload(request.payload);

    const phone = await this.otpService.verifyOtp(request.payload.otp);
    await this.userService.verifyUser(phone);

    const response = h.response({
      status: 'success',
      message: 'Berhasil mendaftarkan akun',
    });
    response.code(200);
    return response;
  }
}

module.exports = OtpHandler;

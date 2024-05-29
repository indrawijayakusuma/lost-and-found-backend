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
    await this.otpservice.createOtp(phone);

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

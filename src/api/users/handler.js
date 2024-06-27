const fs = require('fs');
const bcrypt = require('bcrypt');
const twilio = require('../../utlis/twilio');
const cloudinary = require('../../utlis/cloudinary');

class UserHandler {
  constructor(service, validator, otpservice, tokenPasswordService) {
    this.service = service;
    this.validator = validator;
    this.otpservice = otpservice;
    this.tokenPasswordService = tokenPasswordService;
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

  async updateUserHandler(request, h) {
    this.validator.validateUpdateUserPayload(request.payload);
    const { id: userId } = request.auth.credentials;
    const { fullname, username, email } = request.payload;
    await this.service.updateUser({
      userId, fullname, username, email,
    });
    const response = h.response({
      status: 'success',
      message: 'User berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  async getUserByIdHandler(request) {
    const { id } = request.auth.credentials;
    const user = await this.service.getUserById(id);

    return {
      status: 'seccess',
      data: {
        user,
      },
    };
  }

  async updatePasswordHandler(request, h) {
    this.validator.validateUpdatePasswordPayload(request.payload);
    const { id } = request.auth.credentials;
    const { newPassword, oldPassword } = request.payload;
    const hashPassword = await bcrypt.hash(newPassword, 10);
    await this.service.updatePassword({ id, password: hashPassword, oldPassword });
    const response = h.response({
      status: 'success',
      message: 'Password berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  async postUpdateForgetPasswordHandler(request, h) {
    const { phone, otp, password } = request.payload;
    await this.otpService.getOtpByPhoneAndOtpCode(phone, otp);
    await this.otpService.deleteOtp(otp);
    const hashPassword = await bcrypt.hash(password, 10);
    await this.service.updateForgetPassword({ phone, password: hashPassword });
    const response = h.response({
      status: 'success',
      message: 'Password berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  async updateImageHandler(request, h) {
    const { image } = request.payload;
    this.validator.validateUpdateImagePayload(request.payload);
    this.validator.validateImageHeader(image.headers);
    const { id: userId } = request.auth.credentials;
    const result = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          gravity: 'face', height: 200, width: 200, crop: 'thumb',
        },
        { radius: 'max' },
        { fetch_format: 'auto' },
      ],
    });
    fs.unlinkSync(image.path);
    await this.service.updatePicture({ userId, picture: result.secure_url });
    const response = h.response({
      status: 'success',
      message: 'image berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
}

module.exports = UserHandler;

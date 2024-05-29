const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class OtpService {
  constructor() {
    this.pool = new Pool();
  }

  async verifyOtp(otp) {
    const query = {
      text: 'SELECT * FROM otps WHERE otp_code = $1',
      values: [otp],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('OTP tidak valid');
    }

    if (result.rows.otp_expires < Date.now()) {
      await this.deleteOtp(otp);
      throw new InvariantError('OTP telah kadaluarsa');
    }
    await this.deleteOtp(otp);
    return result.rows[0].phone;
  }

  async createOtp(phone) {
    let convertedPhone;
    if (phone.charAt(0) === '0') {
      convertedPhone = phone.substring(1);
    } else {
      convertedPhone = phone;
    }
    const otpExpires = Date.now() + 10 * 60 * 1000;
    const otp = Math.floor(100000 + Math.random() * 900000);

    let query;
    if (await this.getOtpByPhone(phone)) {
      query = {
        text: 'UPDATE otps SET otp_code = $1, otp_expires = $2 WHERE phone = $3 returning *',
        values: [otp, otpExpires, convertedPhone],
      };
    } else {
      query = {
        text: 'INSERT INTO otps VALUES($1, $2, $3) returning *',
        values: [otp, convertedPhone, otpExpires],
      };
    }
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan OTP');
    }
  }

  async getOtpByPhone(phone) {
    const query = {
      text: 'SELECT * FROM otps WHERE phone = $1',
      values: [phone],
    };
    const result = await this.pool.query(query);
    return result.rowCount;
  }

  async deleteOtp(otp) {
    const query = {
      text: 'DELETE FROM otps WHERE otp_code = $1 returning *',
      values: [otp],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menghapus OTP');
    }
  }
}

module.exports = OtpService;

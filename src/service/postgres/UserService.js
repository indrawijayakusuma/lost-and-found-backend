/* eslint-disable import/no-extraneous-dependencies */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationsError = require('../../exceptions/AuthenticationsError');

class UserService {
  constructor() {
    this.pool = new Pool();
  }

  async getUserById(userId) {
    const query = {
      text: 'SELECT User_id, username, fullname, phone, email, picture FROM users WHERE user_id = $1 AND is_verified = true',
      values: [userId],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('User dengan id tersebut tidak ditemukan');
    }

    return result.rows[0];
  }

  async createUser({
    username, password, fullname, phone, email,
  }) {
    const userId = `user-${nanoid(16)}`;
    const hashPassword = await bcrypt.hash(password, 10);
    let convertedPhone;
    if (phone.charAt(0) === '0') {
      convertedPhone = phone.substring(1);
    } else {
      convertedPhone = phone;
    }

    await this.verifyNewUsername(username);
    await this.verifyNewPhone(convertedPhone);

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6) RETURNING user_id',
      values: [
        userId,
        username,
        hashPassword,
        fullname,
        convertedPhone,
        email,
      ],
    };
    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan user');
    }
    return result.rows[0].user_id;
  }

  async updateUser({
    userId, fullname, username, email,
  }) {
    const query = {
      text: 'UPDATE users SET fullname = $1, username = $2, email = $3 WHERE user_id = $4',
      values: [fullname, username, email, userId],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal memperbarui user');
    }
  }

  async updatePicture({ userId, picture }) {
    const query = {
      text: 'UPDATE users SET picture = $1 WHERE user_id = $2 returning *',
      values: [picture, userId],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal memperbarui image profile');
    }
  }

  async updatePassword({ id, password, oldPassword }) {
    const query1 = {
      text: 'SELECT password FROM users WHERE user_id = $1',
      values: [id],
    };

    const resultPassword = await this.pool.query(query1);
    if (!resultPassword.rowCount) {
      throw new InvariantError('User tidak ditemukan');
    }

    const checkPassword = await bcrypt.compare(oldPassword, resultPassword.rows[0].password);
    if (!checkPassword) {
      throw new InvariantError('Password lama tidak sesuai');
    }

    const query = {
      text: 'UPDATE users SET password = $1 WHERE user_id = $2',
      values: [password, id],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal memperbarui password');
    }
  }

  async updateForgetPassword({ phone, password }) {
    const query = {
      text: 'UPDATE users SET password = $1 WHERE phone = $2',
      values: [password, phone],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal memperbarui password');
    }
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1 AND is_verified = true',
      values: [username],
    };
    const result = await this.pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError('Username sudah terdaftar');
    }
  }

  async verifyNewPhone(number) {
    const query = {
      text: 'SELECT phone FROM users WHERE phone = $1 AND is_verified = true',
      values: [number],
    };
    const result = await this.pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError('Nomor tersebut sudah terdaftar');
    }
  }

  async verifyUserCredential(phone, password) {
    let convertedPhone;
    if (phone.charAt(0) === '0') {
      convertedPhone = phone.substring(1);
    } else {
      convertedPhone = phone;
    }
    const query = {
      text: 'SELECT user_id, password, fullname, picture FROM users WHERE phone = $1 AND is_verified = true',
      values: [convertedPhone],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new AuthenticationsError('Nomor telfon atau password yang anda masukan salah');
    }

    const {
      user_id: id, password: hashPassword, fullname, picture,
    } = result.rows[0];

    const isMatch = await bcrypt.compare(password, hashPassword);

    if (!isMatch) {
      throw new AuthenticationsError('Nomor telfon atau password yang anda masukan salah');
    }

    return { id, fullname, picture };
  }

  async verifyUser(phone) {
    const query = {
      text: 'UPDATE users SET is_verified = true WHERE phone = $1 AND is_verified = false',
      values: [phone],
    };
    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new AuthenticationsError('Nomor telfon yang anda masukan salah');
    }
  }
}

module.exports = UserService;

/* eslint-disable camelcase */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class ValidationService {
  constructor() {
    this.pool = new Pool();
  }

  async createValidation({ postId, validationUserId }) {
    await this.validateValidationByValidationUserId(postId, validationUserId);
    const statusValidation = 'Diproses';
    const id = `validation-${nanoid(16)}`;
    const date = new Date();

    const query = {
      text: 'INSERT INTO validations VALUES($1, $2, $3, $4, $5) RETURNING validation_id',
      values: [id, statusValidation, date, postId, validationUserId],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to create validation');
    }

    return result.rows[0].validation_id;
  }

  async accValidation({ id }) {
    const query = {
      text: "UPDATE validations SET status_validation = 'Tervalidasi' WHERE validation_id = $1 RETURNING *",
      values: [id],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to update validation');
    }
  }

  async rejectValidation({ id }) {
    const query = {
      text: "UPDATE validations SET status_validation = 'Ditolak' WHERE validation_id = $1 RETURNING *",
      values: [id],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to update validation');
    }
  }

  async completeValidation({ id }) {
    const query = {
      text: "UPDATE validations SET status_validation = 'Selesai' WHERE validation_id = $1 RETURNING *",
      values: [id],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to update validation');
    }
  }

  async getPostValidationByUserId(userId) {
    const query = {
      text: `SELECT posts.post_id, validations.validation_id, item_name, location, address, image, status_validation FROM validations
      LEFT JOIN posts ON posts.post_id = validations.post_id 
      LEFT JOIN found_items ON found_items.post_id = posts.post_id
      LEFT JOIN locations ON locations.found_item_id = found_items.post_id
      WHERE posts.user_id = $1
      `,
      values: [userId],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getMyValidationByUserId(userId) {
    const query = {
      text: `SELECT posts.post_id, validations.validation_id, item_name, location, address, image, status_validation,
          CASE 
            WHEN validations.status_validation = 'Tervalidasi' THEN users.phone 
            ELSE NULL
          END AS phone
          FROM validations
          LEFT JOIN posts ON posts.post_id = validations.post_id 
          LEFT JOIN found_items ON found_items.post_id = posts.post_id
          LEFT JOIN locations ON locations.found_item_id = found_items.post_id
          LEFT JOIN users ON users.user_id = posts.user_id
          WHERE validations.validation_user_id = $1
      `,
      values: [userId],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getValidationQuestionAnswer(validationId) {
    const query = {
      text: `SELECT validations.validation_id, questions.question, answers.answer
        FROM validations
        INNER JOIN posts ON posts.post_id = validations.post_id
        INNER JOIN answers ON answers.validation_id = validations.validation_id
        INNER JOIN questions ON questions.post_id = posts.post_id
        WHERE validations.validation_id = $1`,
      values: [validationId],
    };
    const result = await this.pool.query(query);
    const { question, answer, validation_id } = result.rows[0];
    const answerQuestion = question.map((q, index) => ({
      question: q,
      answer: answer[index],
    }));
    return {
      validation_id,
      answerQuestion,
    };
  }

  async validateValidationByValidationUserId(postId, validationUserId) {
    const query = {
      text: 'SELECT validation_id FROM validations WHERE validation_user_id = $1 AND post_id = $2',
      values: [validationUserId, postId],
    };
    const result = await this.pool.query(query);
    if (result.rowCount) {
      throw new InvariantError('Anda telah melakukan Klaim pada barang ini');
    }
  }
}

module.exports = ValidationService;

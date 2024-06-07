const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class ValidationService {
  constructor(pool) {
    this.pool = pool;
  }

  async createValidation({ statusValidation, postId, validationUserId }) {
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

  async updateValidation({ id, statusValidation }) {
    const query = {
      text: 'UPDATE validations SET status_validation = $1 WHERE validation_id = $2 RETURNING *',
      values: [statusValidation, id],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to update validation');
    }
  }
}

module.exports = ValidationService;
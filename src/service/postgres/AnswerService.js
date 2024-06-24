const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class AnswerService {
  constructor(pool) {
    this.pool = pool;
  }

  async createAnswer({ answer, validationId }) {
    const id = `answer-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO answers VALUES($1, $2, $3) RETURNING *',
      values: [id, answer, validationId],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to create answer');
    }
    return result.rows[0];
  }

  async deleteAnswer(id) {
    const query = {
      text: 'DELETE FROM answers WHERE answer_id = $1 RETURNING *',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to delete answer');
    }
    return result.rows[0];
  }

  async updateAnswer({ id, answer }) {
    const query = {
      text: 'UPDATE answers SET answer = $1 WHERE answer_id = $2 RETURNING *',
      values: [answer, id],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to update answer');
    }
    return result.rows[0];
  }
}

module.exports = AnswerService;

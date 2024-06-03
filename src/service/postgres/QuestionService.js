const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class QuestionService {
  constructor() {
    this.pool = new Pool();
  }

  async createQuestion({ question, postId }) {
    const id = `question-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO questions VALUES($1, $2, $3) RETURNING *',
      values: [id, question, postId],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to create question');
    }
    return result.rows[0];
  }

  async updateQuestion({ id, question }) {
    const query = {
      text: 'UPDATE questions SET question = $1 WHERE question_id = $2 RETURNING *',
      values: [question, id],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to update question');
    }
    return result.rows[0];
  }

  async deleteQuestion(id) {
    const query = {
      text: 'DELETE FROM questions WHERE question_id = $1 RETURNING *',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to delete question');
    }
    return result.rows[0];
  }
}
module.exports = QuestionService;

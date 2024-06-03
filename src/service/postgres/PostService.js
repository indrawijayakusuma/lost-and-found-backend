const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PostService {
  constructor() {
    this.pool = new Pool();
  }

  async createPost({ userId }) {
    const id = `post-${nanoid(16)}`;
    const date = new Date();
    const query = {
      text: 'INSERT INTO posts VALUES($1, $2, $3, $4) RETURNING *',
      values: [id, false, date, userId],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to create post');
    }
    return result.rows[0].post_id;
  }

  async getAllFoundItemPosts() {
    const query = {
      text: `SELECT posts.post_id, is_claimed, posts.date as post_date, item_type, color, secondary_color, found_items.date as found_date,
      found_items.image, label_location, location, address, additional_info
      FROM posts 
      INNER JOIN found_items ON found_items.post_id = posts.post_id
      INNER JOIN locations ON locations.location_id = found_items.post_id
      WHERE is_claimed = false`,
    };
    const result = await this.pool.query(query);
    return result.rows;
  }

  async getPostsByUserId(userId) {
    const query = {
      text: `SELECT posts.post_id, item_name, location, address, status_validation  
      FROM posts 
      INNER JOIN found_items ON found_items.post_id = posts.post_id
      INNER JOIN locations ON locations.location_id = found_items.post_id
      WHERE user_id = $1`,
      values: [userId],
    };
    const result = await this.pool.query(query);
    return result.rows;
  }
}

module.exports = PostService;

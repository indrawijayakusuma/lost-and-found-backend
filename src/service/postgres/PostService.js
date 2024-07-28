/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
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

  async getFoundItemPosts({
    search, limit, page, location,
  }) {
    const limitNum = parseInt(limit, 10);
    const offset = (page - 1) * limit;
    const searchAdd = `%${search}%`;

    let queryText = `
      SELECT posts.post_id, item_name, tipe_barang, location, address, count(found_items.post_id) over() as total
      FROM posts 
      INNER JOIN found_items ON found_items.post_id = posts.post_id
      INNER JOIN locations ON locations.found_item_id = found_items.post_id
      WHERE is_claimed = false
    `;
    const queryValues = [];

    if (search) {
      queryText += ` AND LOWER(item_name) LIKE LOWER($${queryValues.length + 1})`;
      queryValues.push(searchAdd);
    }

    if (location) {
      queryText += ` AND LOWER(location) = LOWER($${queryValues.length + 1})`;
      queryValues.push(location);
    }
    queryText += ` LIMIT $${queryValues.length + 1} OFFSET $${queryValues.length + 2}`;
    queryValues.push(limitNum, offset);

    const query = {
      text: queryText,
      values: queryValues,
    };

    const result = await this.pool.query(query);
    let total;
    !result.rowCount ? total = 0 : total = result.rows[0].total;
    // num total means total of posts
    const numTotal = parseInt(total, 10);
    const totalPage = Math.ceil(numTotal / limitNum);
    const startIndex = (page - 1) * limit + 1;
    const endIndex = result.rows.length + startIndex - 1;

    const resultRows = result.rows.map((row) => ({
      postId: row.post_id,
      itemName: row.item_name,
      tipeBarang: row.tipe_barang,
      location: `${row.address}, ${row.location}`,
    }));

    return {
      numTotal, totalPage, startIndex, endIndex, item: resultRows,
    };
  }

  async updatePost({
    itemName, tipeBarang, color, secondaryColor, date, url: image,
    labelLocation, location, address, additionalInfo, postId, locationId, questions, questionId,
  }) {
    try {
      await this.pool.query('BEGIN');

      const queryUpdateFoundItem = {
        text: `UPDATE found_items 
        SET item_name = $1, tipe_barang = $2, color = $3, secondary_color = $4, date = $5, image = $6
        WHERE post_id = $7`,
        values: [
          itemName,
          tipeBarang,
          color,
          secondaryColor,
          date,
          image,
          postId,
        ],
      };
      await this.pool.query(queryUpdateFoundItem);

      const queryUpdateLocation = {
        text: `UPDATE locations
        SET label_location = $1, location = $2, address = $3, additional_info = $4, found_item_id = $5
        WHERE location_id = $6`,
        values: [
          labelLocation, location, address, additionalInfo, postId, locationId,
        ],
      };
      await this.pool.query(queryUpdateLocation);

      const queryUpdateQuestion = {
        text: `UPDATE questions
        SET question = $1
        WHERE question_id = $2`,
        values: [
          questions, questionId,
        ],
      };
      await this.pool.query(queryUpdateQuestion);

      await this.pool.query('COMMIT');
    } catch {
      await this.pool.query('ROLLBACK');
      throw new InvariantError('Failed to update post');
    }
  }

  async getPostUpdateById(postId) {
    const query = {
      text: `SELECT posts.post_id, user_id, item_name, tipe_barang, color, secondary_color, found_items.date, 
      image, location_id, label_location, location, address, additional_info, found_item_id, question_id, question
      FROM posts 
      INNER JOIN found_items ON found_items.post_id = posts.post_id
      INNER JOIN locations ON locations.found_item_id = found_items.post_id
      INNER JOIN questions ON questions.post_id = posts.post_id
      WHERE posts.post_id = $1`,
      values: [postId],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Post tidak tersedia');
    }
    return result.rows[0];
  }

  async getPostsByUserId({ userId }) {
    const query = {
      text: `SELECT posts.post_id, item_name, location, address, image 
      FROM posts 
      INNER JOIN found_items ON found_items.post_id = posts.post_id
      INNER JOIN locations ON locations.found_item_id = found_items.post_id
      WHERE posts.user_id =  $1`,
      values: [userId],
    };
    const result = await this.pool.query(query);
    return result.rows;
  }

  async getNumberOfPostsByUserId(userId) {
    const query = {
      text: `SELECT count(posts.post_id) as total
      FROM posts 
      WHERE user_id = $1`,
      values: [userId],
    };
    const result = await this.pool.query(query);
    return result.rows[0].total;
  }

  async getPostById(postId) {
    const query = {
      text: `SELECT posts.post_id, is_claimed, item_name, location, address, additional_info, found_items.date, found_items.image, users.user_id, users.fullname, users.picture 
      FROM posts 
      INNER JOIN found_items ON found_items.post_id = posts.post_id
      INNER JOIN locations ON locations.found_item_id = found_items.post_id
      INNER JOIN users ON users.user_id = posts.user_id
      WHERE posts.post_id = $1`,
      values: [postId],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Post tidak tersedia');
    }
    const {
      post_id, item_name, location, address, additional_info, date,
      image, fullname, picture, user_id, is_claimed,
    } = result.rows[0];
    const postNumber = await this.getNumberOfPostsByUserId(user_id);
    return {
      post_id,
      is_claimed,
      item_name,
      location,
      address,
      additional_info,
      date,
      image,
      fullname,
      picture,
      user_id,
      postNumber,
    };
  }

  async validatePostOwner({ postId, userId }) {
    const query = {
      text: `SELECT *
      FROM posts
      WHERE user_id = $1 and post_id = $2`,
      values: [userId, postId],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('user bukan pemilik postingan');
    }
  }
}

module.exports = PostService;

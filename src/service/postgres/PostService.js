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

  async getFoundItemPosts({ search, limit, page }) {
    const limitNum = parseInt(limit, 10);
    const offset = (page - 1) * limit;
    const searchAdd = `%${search}%`;
    let query;
    if (search) {
      query = {
        text: `SELECT posts.post_id, item_name, tipe_barang, location, address
        FROM posts 
        INNER JOIN found_items ON found_items.post_id = posts.post_id
        INNER JOIN locations ON locations.found_item_id= found_items.post_id
        WHERE is_claimed = false
        AND LOWER(item_name) LIKE LOWER($1)
        LIMIT $2 OFFSET $3`,
        values: [searchAdd, limitNum, offset],
      };
    } else {
      query = {
        text: `SELECT posts.post_id, item_name, tipe_barang, location, address, count(found_items.post_id) over() as total 
        FROM posts 
        INNER JOIN found_items ON found_items.post_id = posts.post_id
        INNER JOIN locations ON locations.found_item_id= found_items.post_id
        WHERE is_claimed = false
        LIMIT $1 OFFSET $2`,
        values: [limitNum, offset],
      };
    }
    const result = await this.pool.query(query);
    const { total } = result.rows[0];
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
      text: `SELECT posts.post_id, item_name, location, address, additional_info, found_items.date, found_items.image, users.user_id, users.fullname, users.picture 
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
      image, fullname, picture, user_id,
    } = result.rows[0];
    const postNumber = await this.getNumberOfPostsByUserId(user_id);
    return {
      post_id,
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
}

module.exports = PostService;

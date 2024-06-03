const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class FoundItemService {
  constructor() {
    this.pool = new Pool();
  }

  async createFoundItem({
    postId, tipeBarang, color, secondaryColor, date, image, itemName,
  }) {
    const query = {
      text: 'INSERT INTO found_items VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING post_id',
      values: [
        postId,
        itemName,
        tipeBarang,
        color,
        secondaryColor,
        date,
        image,
      ],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan item');
    }
    return result.rows[0].id;
  }

  async deleteFoundItem(postid) {
    const query = {
      text: 'DELETE FROM found_items WHERE post_id = $1 RETURNING post_id',
      values: [postid],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menghapus item');
    }
  }

  async updateFoundItem(postid, tipeBarang, color, secondaryColor, date, image) {
    const query = {
      text: 'UPDATE found_items SET type_item = $1, color = $2, secondary_color = $3, date = $4, image = $5 WHERE post_id = $6 RETURNING post_id',
      values: [
        tipeBarang,
        color,
        secondaryColor,
        date,
        image,
        postid,
      ],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal mengupdate item');
    }
  }
}

module.exports = FoundItemService;

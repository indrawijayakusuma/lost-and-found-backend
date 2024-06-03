const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class LocationService {
  constructor() {
    this.pool = new Pool();
  }

  async createLocation({
    labelLocation, location, address, additionalInfo, postId,
  }) {
    const locationId = `location-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO locations VALUES($1, $2, $3, $4, $5, $6) RETURNING location_id',
      values: [locationId, labelLocation, location, address, additionalInfo, postId],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan lokasi');
    }
    return result.rows[0].location_id;
  }
}

module.exports = LocationService;

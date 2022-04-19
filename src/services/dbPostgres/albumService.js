const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../expction/invariantError');
const { mapDBToModelAlbums } = require('../../util/albumsDb');
const NotFoundError = require('../../expction/notFoundError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbums({ name, years }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3,) RETURNING id',
      values: [id, name, years],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumsById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    return result.rows.map(mapDBToModelAlbums)[0];
  }

  async editAlbumsById(id, { name, years }) {
    const query = {
      text: 'UPDATE albums SET name = $1, years = $2, WHERE id = $3 RETURNING id',
      values: [name, years, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }
  }

  async deleteAlbumsById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;
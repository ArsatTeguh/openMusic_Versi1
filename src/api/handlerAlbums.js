const ClientError = require('../expction/clientError');

class AlbumsHandler {
  constructor(service, validator) {
    this._Service = service;
    this._Validator = validator;
    this.postAlbumsHandler = this.postAlbumsHandler.bind(this);
    this.getAlbumsByIdHandler = this.getAlbumsByIdHandler.bind(this);
    this.putAlbumsByIdHandler = this.putAlbumsByIdHandler.bind(this);
    this.deleteAlbumsByIdHandler = this.deleteAlbumsByIdHandler.bind(this);
  }

  async postAlbumsHandler(req, h) {
    try {
      this._Validator.validateAlbumsPayload(req.payload);
      const { name, years } = req.payload;

      // mettod addnote mengembalikan id
      const albumsId = await this._Service.addAlbums({ name, years });

      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil ditambahkan',
        data: {
          albumsId,
        },
      });
      response.code(201);
      return response;
    } catch (e) {
      if (e instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: e.message,
        });
        response.code(e.statusCode);
        return response;
      }

      // Handle Server Error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(e);
      return response;
    }
  }

  async getAlbumsByIdHandler(req, h) {
    try {
      const { id } = req.params;
      const albums = await this._Service.getAlbumsById(id);
      return {
        status: 'success',
        data: {
          albums,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Handling Server Error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async putAlbumsByIdHandler(request, h) {
    try {
      this._Validator.validateAlbumsPayload(request.payload);
      const { id } = request.params;

      await this._Service.editAlbumsById(id, request.payload);

      return {
        status: 'success',
        message: 'Catatan berhasil diperbarui',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Hendling Server Error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteAlbumsByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._Service.deleteAlbumsById(id);
      return {
        status: 'success',
        message: 'Catatan berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Hendling Server Error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = AlbumsHandler;
const Hapi = require('@hapi/hapi');
const OpenMusik = require('./src/api/index');
const AlbumsSevice = require('./src/services/dbPostgres/albumService');
const validatorAlbums = require('./src/validator/albumsValidate');
require('dotenv').config();

const init = async () => {
  const AlbumsService = new AlbumsSevice();
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: true,
  });

  await server.register({
    plugin: OpenMusik,
    options: {
      service: AlbumsService,
      validator: validatorAlbums,
    },
  });
  await server.start();
  console.log(`Server Berjalan Di Port ${server.info.uri}`);
};
init();
const Hapi = require('@hapi/hapi');
const OpenMusik = require('./src/api/index');
const OpenMusik2 = require('./src/api/indexSongs')
const songsService = require('./src/services/dbPostgres/songsService');
const AlbumsSevice = require('./src/services/dbPostgres/albumService');
const validatorAlbums = require('./src/validator/albumsValidate');
const validatorSongs = require('./src/validator/songsValidate')
require('dotenv').config();

const init = async () => {
  const AlbumsService = new AlbumsSevice();
  const SongsService = new songsService();
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: true,
  });

  await server.register([{
    plugin: OpenMusik,
    options: {
      service: AlbumsService,
      validator: validatorAlbums,
    }, 
},
{
  plugin: OpenMusik2,
  options: {
  service: SongsService,
  validator: validatorSongs,
  }
},
  ]);
  await server.start();
  console.log(`Server Berjalan Di Port ${server.info.uri}`);
};
init();
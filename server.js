const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const OpenMusik = require('./src/api/index');
const OpenMusik2 = require('./src/api/indexSongs');
const songsService = require('./src/services/dbPostgres/songsService');
const AlbumsSevice = require('./src/services/dbPostgres/albumService');
const validatorAlbums = require('./src/validator/albumsValidate');
const validatorSongs = require('./src/validator/songsValidate');

// users
const users = require('./src/api/Users');
const UsersService = require('./src/services/dbPostgres/usersService');
const userValidator = require('./src/validator/Users/index');

// playlist
const playlist = require('./src/api/Playlist');
const PlaylistsService = require('./src/services/dbPostgres/playlistsService');
const playlistValidator = require('./src/validator/Playlist')

//authentications
const authentications = require('./src/authentications');
const AuthenticationsService = require('./src/services/dbPostgres/authenticationsService');
const TokenManager = require('./src/Tokenize/tokenManeger');
const AuthenticationsValidator = require('./src/validator/Authentications');

//Collaborations
const CollaborationsService = require('./src/services/dbPostgres/collaborationsService');

require('dotenv').config();

const init = async () => {
  const AlbumsService = new AlbumsSevice();
  const SongsService = new songsService();
  const userService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService()
  const collaborationsService = new CollaborationsService(playlistsService)
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: true,
  });

    // registrasi plugin eksternal
    await server.register([
      {
        plugin: Jwt,
      },
    ]);
   
    // mendefinisikan strategy autentikasi jwt
    server.auth.strategy('openmusic_jwt', 'jwt', {
      keys: process.env.ACCESS_TOKEN_KEY,
      verify: {
        aud: false,
        iss: false,
        sub: false,
        maxAgeSec: process.env.ACCESS_TOKEN_AGE,
      },
      validate: (artifacts) => ({
        isValid: true,
        credentials: {
          id: artifacts.decoded.payload.id,
        },
      }),
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
    },
  },
  {
    plugin: users,
    options: {
      service: userService,
      validator: userValidator,
    },
  },
  {
    plugin: playlist,
    options: {
      service: playlistsService,
      validator: playlistValidator,
    },
  },
  {
    plugin: authentications,
    options: {
      authenticationsService,
      userService,
      tokenManager: TokenManager,
      validator: AuthenticationsValidator,
    },
  },
  ]);
  await server.start();
  console.log(`Server Berjalan Di Port ${server.info.uri}`);
};
init();
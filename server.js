const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const OpenMusik = require('./src/api/index');
const OpenMusik2 = require('./src/api/indexSongs');
const SongsService = require('./src/services/dbPostgres/songsService');
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

// PlaylistSongs
const playlistSongs = require('./src/api/PlaylistSongs');
const PlaylistsSongsService = require('./src/services/dbPostgres/playlistsSongsService');
const PlaylistSongsValidator = require('./src/validator/PlaylistsSongsValidator');

require('dotenv').config();

const init = async () => {
  const AlbumsService = new AlbumsSevice();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const playlistsSongsService = new PlaylistsSongsService()
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
      service: songsService,
      validator: validatorSongs,
    },
  },
  {
    plugin: users,
    options: {
      service: usersService,
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
      usersService,
      tokenManager: TokenManager,
      validator: AuthenticationsValidator,
    },
  },
  {
    plugin: playlistSongs,
    options: {
      service: {
        playlistsSongsService,
          songsService,
          playlistsService,
        },
        validator: PlaylistSongsValidator,
    },
  },

  ]);
  await server.start();
  console.log(`Server Berjalan Di Port ${server.info.uri}`);
};
init();
const AlbumsHandler = require('./handlerAlbums');
const routes = require('./routes');

module.exports = {
  name: 'openMusik',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const newAlbumsHandler = new AlbumsHandler(service, validator);
    server.route(routes(newAlbumsHandler));
  },
};
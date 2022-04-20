const Songshandler = require('./handlerSongs');
const routes = require('./routeSongs');

module.exports = {
  name: 'openMusik2',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const newSongsHandler = new Songshandler(service, validator);
    server.route(routes(newSongsHandler));
  },
};
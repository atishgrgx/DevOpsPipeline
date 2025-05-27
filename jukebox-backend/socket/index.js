// socket/index.js
const collabPlaylistHandler = require('./collabPlaylist');
const chatHandler = require('./chat');

let io;

module.exports = {
  init: (server) => {
    io = require('socket.io')(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', async (socket) => {
      console.log('Socket connected:', socket.id);

      // Pass the same socket instance to both handlers
      collabPlaylistHandler(io, socket);
      await chatHandler(io, socket); // chatHandler is async
    });

    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error('Socket.IO not initialized!');
    }
    return io;
  },
};

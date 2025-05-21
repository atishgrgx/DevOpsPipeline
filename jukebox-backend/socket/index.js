const socketIO = require('socket.io');

let io;

module.exports = {
  init: (server) => {
    io = socketIO(server, {
      cors: {
        origin: '*', // or your frontend url
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Add socket event handlers here if needed
      socket.on('joinPlaylist', (playlistId) => {
        socket.join(`playlist-${playlistId}`);
        console.log(`${socket.id} joined playlist-${playlistId}`);
      });

      socket.on('leavePlaylist', (playlistId) => {
        socket.leave(`playlist-${playlistId}`);
        console.log(`${socket.id} left playlist-${playlistId}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) throw new Error('Socket.IO not initialized!');
    return io;
  },
};

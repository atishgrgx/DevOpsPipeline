// socket/collabPlaylist.js
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🎧 User connected:', socket.id);

    // Join a playlist room
    socket.on('joinPlaylist', (playlistId) => {
      socket.join(`playlist-${playlistId}`);
      console.log(`🔗 User joined playlist-${playlistId}`);
    });

    // Leave playlist room (optional)
    socket.on('leavePlaylist', (playlistId) => {
      socket.leave(`playlist-${playlistId}`);
      console.log(`❌ User left playlist-${playlistId}`);
    });

    socket.on('disconnect', () => {
      console.log('🚪 User disconnected:', socket.id);
    });
  });
};

// socket/collabPlaylist.js
const playlists = {}; // Shared across connections
const userMap = {}
module.exports = (io, socket) => {
  console.log('⚡ Handling playlist events for', socket.id);

  socket.emit('welcome', '👋 Welcome to the Jukebox socket server!');

  socket.on('joinPlaylist', ({playlistId,username} ) => {
    socket.join(`playlist-${playlistId}`);
    userMap[socket.id] = username;

    // Emit to others in the room that a new user joined
    socket.to(`playlist-${playlistId}`).emit('userJoined', {
      userId: socket.id, // or user name if you track it
      username,
      message: `A user joined playlist-${playlistId}`
    });

    if (playlists[playlistId]) {
      socket.emit('updatePlaylist', playlists[playlistId]);
    }
  });

  socket.on('leavePlaylist', (playlistId) => {
    socket.leave(`playlist-${playlistId}`);
    console.log(`❌ ${socket.id} left playlist-${playlistId}`);
  });

  // socket.on('newSong', ({ playlistId, song }) => {
  //   if (!playlists[playlistId]) {
  //     playlists[playlistId] = [];
  //   }
  //   playlists[playlistId].push(song);
  //   io.to(`playlist-${playlistId}`).emit('updatePlaylist', playlists[playlistId]);
  //   console.log(`🎵 New song added to playlist-${playlistId}:`, song);
  // });

  socket.on('disconnect', () => {
    const username = userMap[socket.id];
    console.log(`🚪 Socket disconnected: ${socket.id} (${username || 'Unknown user'})`);
    delete userMap[socket.id];
  });
};

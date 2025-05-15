const userSockets = {}; // Map emails to socket IDs
const roomMessages = {}; // Optional: store messages by room name

module.exports = (io) => {
  io.on('connection', (socket) => {
    const email = socket.handshake.query.email;

    if (email) {
      userSockets[email] = socket.id;
      console.log(`User connected: ${email}`);
    }

    // Group chat room join
    socket.on('joinRoom', (roomName) => {
      socket.join(roomName);
      const history = roomMessages[roomName] || [];
      socket.emit('roomHistory', history);
    });

    // Group message
    socket.on('chatMessage', ({ room, message }) => {
      if (!roomMessages[room]) roomMessages[room] = [];
      roomMessages[room].push(message);
      io.to(room).emit('chatMessage', message);
    });

    // Private message handling
    socket.on('privateMessage', ({ to, message, sender }) => {
      const targetSocketId = userSockets[to];
      if (targetSocketId) {
        io.to(targetSocketId).emit('privateMessage', { message, sender });
        console.log(`Sent private message from ${sender} to ${to}: ${message}`);
      } else {
        console.warn(`User ${to} not connected`);
      }
    });

    socket.on('disconnect', () => {
      if (email && userSockets[email]) {
        delete userSockets[email];
        console.log(`Disconnected: ${email}`);
      }
    });
  });
};

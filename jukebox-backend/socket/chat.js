const userSockets = {}; // Map emails to socket IDs
const roomMessages = {}; // Store group messages by room
const privateMessages = {}; // Store private messages by sorted user key

const {
  saveChatToS3,
  loadChatFromS3,
  savePrivateChatToS3,
  loadPrivateChatFromS3
} = require('../services/s3ChatService'); // Adjust path if needed

module.exports = (io) => {
  io.on('connection', async (socket) => {
    const email = socket.handshake.query.email;

    if (email) {
      userSockets[email] = socket.id;
      console.log(`✅ User connected: ${email}`);
    }

    // ===== GROUP CHAT =====
    socket.on('joinRoom', async (roomName) => {
      socket.join(roomName);

      // Load from S3 if not in memory
      if (!roomMessages[roomName]) {
        roomMessages[roomName] = await loadChatFromS3(roomName);
      }

      socket.emit('roomHistory', roomMessages[roomName]);
    });

    socket.on('chatMessage', async ({ room, message }) => {
      if (!roomMessages[room]) roomMessages[room] = [];
      roomMessages[room].push(message);

      io.to(room).emit('chatMessage', message);

      // Save to S3
      await saveChatToS3(room, roomMessages[room]);
    });

    // ===== PRIVATE CHAT =====
    socket.on('privateMessage', async ({ to, message, sender }) => {
      const targetSocketId = userSockets[to];
      const key = [sender, to].sort().join('_'); // Consistent key

      // Load private chat if not already in memory
      if (!privateMessages[key]) {
        privateMessages[key] = await loadPrivateChatFromS3(sender, to);
      }

      privateMessages[key].push(message);

      // Send to recipient if connected
      if (targetSocketId) {
        io.to(targetSocketId).emit('privateMessage', { message, sender });
        console.log(`📨 Private message from ${sender} to ${to}: ${message}`);
      } else {
        console.warn(`⚠️ User ${to} not connected`);
      }

      // Save to S3
      await savePrivateChatToS3(sender, to, privateMessages[key]);
    });

    // ✅ Load private chat history manually (when frontend requests)
    socket.on('loadPrivateChat', async ({ withUser }) => {
      const me = socket.handshake.query.email;
      const key = [me, withUser].sort().join('_');

      if (!privateMessages[key]) {
        privateMessages[key] = await loadPrivateChatFromS3(me, withUser);
      }

      socket.emit('privateChatHistory', {
        withUser,
        history: privateMessages[key],
      });
    });

    // ===== DISCONNECT =====
    socket.on('disconnect', () => {
      if (email && userSockets[email]) {
        delete userSockets[email];
        console.log(`❌ Disconnected: ${email}`);
      }
    });
  });
};

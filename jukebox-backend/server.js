require('dotenv').config(); // Load .env variables

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');

const app = express(); // ✅ define app only once
const server = http.createServer(app);

// ✅ Setup Socket.IO with CORS for frontend on 127.0.0.1:5500
const io = socketIO(server, {
  cors: {
    origin: "*", // Or 'http://127.0.0.1:5500'
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;
// Routes
const authRoutes = require('./routes/authRoutes');
const songRoutes = require('./routes/songRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
// ✅ Apply CORS BEFORE any routes
const userListRoutes = require('./routes/userlistRoutes');
// Apply Express CORS before routes
app.use(cors());

// Getting user list
app.use('/api/users', userListRoutes);


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors()); // allow all origins during development

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB Atlas!');
});
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

// REST Routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes); 

// WebSocket logic (keep chat logic in a separate file)
require('./socket/chat')(io);

// Start HTTP server
server.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const http = require('http');

const app = express();
const server = http.createServer(app);

// ✅ Use central socket manager
const socketManager = require('./socket');
socketManager.init(server); // Automatically hooks in collabPlaylist.js

// Port
const PORT = process.env.PORT || 3000;

// Routes
const authRoutes = require('./routes/authRoutes');
const songRoutes = require('./routes/songRoutes');
const collabPlaylistRoutes = require('./routes/collabPlaylistRoutes');
const userListRoutes = require('./routes/userlistRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MongoDB
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlist', collabPlaylistRoutes);
app.use('/api/users', userListRoutes);

// ✅ Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware order matters! ✅
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // ✅ Apply cookie-parser before session
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB Atlas!');
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// API Routes (After session & cookieParser!)
const authRoutes = require('./routes/authRoutes');
const songRoutes = require('./routes/songRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userListRoutes = require('./routes/userlistRoutes');
const viewRoutes = require('./routes/viewRoutes');
const playlistRoutes = require('./routes/playlistRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/users', userListRoutes);
app.use('/api/users', adminRoutes);
app.use('/api/playlists', playlistRoutes); 
app.use('/', viewRoutes);

// WebSocket Chat
require('./socket/chat')(io);

// Serve frontend assets
app.use(express.static(path.join(__dirname, '../jukebox-frontend')));

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

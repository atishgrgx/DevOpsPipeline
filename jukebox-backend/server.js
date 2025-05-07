require('dotenv').config(); // Load .env variables

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors'); // ✅ Moved up here

const app = express();
const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/authRoutes');

// ✅ Apply CORS BEFORE any routes
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Type Ctrl+C to shut down the web server');
});

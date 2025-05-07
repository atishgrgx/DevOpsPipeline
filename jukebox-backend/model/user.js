const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String, // optional for Spotify users
  spotify: {
    id: String,
    displayName: String,
    email: String,
    accessToken: String,
    refreshToken: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);

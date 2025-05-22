const express = require('express');
const router = express.Router();
const User = require('../model/user');

//GET /api/users — return username, email, and blocked
router.get('/', async (req, res) => {
  const excludeEmail = req.query.exclude;
  try {
    const filter = excludeEmail ? { email: { $ne: excludeEmail } } : {};
    const users = await User.find(filter).select('username email blocked');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

//api/users/block/:id
router.patch('/block/:id', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { blocked: true });
    res.json({ message: 'User blocked successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to block user' });
  }
});

//api/users/unblock/:id
router.patch('/unblock/:id', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { blocked: false });
    res.json({ message: 'User unblocked successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unblock user' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../model/user');

router.get('/', async (req, res) => {
  const excludeEmail = req.query.exclude;
  try {
    const filter = excludeEmail ? { email: { $ne: excludeEmail } } : {};
    const users = await User.find(filter).select('username email');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;

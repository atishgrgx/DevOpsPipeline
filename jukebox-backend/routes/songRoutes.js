const express = require('express');
const router = express.Router();
const { saveSongsFromFile } = require('../controller/songController.js');

router.get('/save-from-file', saveSongsFromFile);

module.exports = router;

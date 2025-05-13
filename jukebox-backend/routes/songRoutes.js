const express = require('express');
const router = express.Router();
const { saveSongsFromFile, saveSongsByName } = require('../controller/songController.js');

router.get('/save-from-file', saveSongsFromFile);
router.get('/search/:songName', saveSongsByName);


module.exports = router;

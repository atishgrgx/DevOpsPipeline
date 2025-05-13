const express = require('express');
const router = express.Router();
const { saveSongsFromFile, saveSongsByName, deleteSongById, getAllSongs } = require('../controller/songController.js');

router.get('/save-from-file', saveSongsFromFile);
router.get('/search/:songName', saveSongsByName);
router.delete('/:songId', deleteSongById);
router.get('/', getAllSongs); 

module.exports = router;

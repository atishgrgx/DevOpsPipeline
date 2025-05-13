const express = require('express');
const router = express.Router();
const { saveSongsFromFile, saveSongsByName, deleteSongById, getAllSongs, getSongById } = require('../controller/songController.js');

router.get('/save-from-file', saveSongsFromFile);
router.get('/search/:songName', saveSongsByName);
router.delete('/:songId', deleteSongById);
router.get('/', getAllSongs); 
router.get('/:id', getSongById); 

module.exports = router;

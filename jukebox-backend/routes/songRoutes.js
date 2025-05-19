const express = require('express');
const router = express.Router();
const { saveSongsFromFile, saveSongsByName, deleteSongById, getAllSongs, getSongByIdDB } = require('../controller/songController.js');

router.get('/save-from-file', saveSongsFromFile);
router.get('/search/:songName', saveSongsByName);
router.delete('/remove/:songId', deleteSongById);
router.get('/', getAllSongs); 
router.get('/:id', getSongByIdDB); 

module.exports = router;

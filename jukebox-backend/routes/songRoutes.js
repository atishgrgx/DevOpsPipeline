const express = require('express');
const router = express.Router();
const { saveSongsFromFile, saveSongsByName, deleteSongById, getAllSongs, getSongByIdDB, getTopSongs } = require('../controller/songController.js');

router.get('/save-from-file', saveSongsFromFile);
router.get('/search/:songName', saveSongsByName);
router.get('/top-songs', getTopSongs);
router.delete('/:songId', deleteSongById);
router.get('/', getAllSongs); 
router.get('/:id', getSongByIdDB); 

module.exports = router;

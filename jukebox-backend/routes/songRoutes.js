const express = require('express');
const router = express.Router();
const { saveSongsFromFile, saveSongsByName, deleteSongById, getAllSongs, getSongByIdDB, getTopSongs, getTopArtists, searchSongs } = require('../controller/songController.js');

router.get('/save-from-file', saveSongsFromFile);
router.get('/search/:songName', saveSongsByName);
router.get('/top-songs', getTopSongs);
router.get('/top-artists', getTopArtists);
router.get('/search-db', searchSongs);
router.delete('/:songId', deleteSongById);
router.get('/', getAllSongs); 
router.get('/:id', getSongByIdDB); 

module.exports = router;

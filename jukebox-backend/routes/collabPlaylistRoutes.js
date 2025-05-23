const express = require('express');
const router = express.Router();
const {getPlaylists,createPlaylist,addSong,removeSong,savePlaylistToUser,test} = require('../controller/collabPlaylistController');

router.get('/all',getPlaylists)
router.post('/create', createPlaylist);
router.post('/:playlistId/add-song', addSong);
router.delete('/:playlistId/remove-song', removeSong);
router.post('/:playlistId/save', savePlaylistToUser);

module.exports = router;
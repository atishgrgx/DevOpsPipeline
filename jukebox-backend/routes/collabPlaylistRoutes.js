const express = require('express');
const router = express.Router();
const controller = require('../controllers/collabPlaylistController');

router.get('/', controller.getPlaylists);
router.post('/create', controller.createPlaylist);
router.post('/:playlistId/add-song', controller.addSong);
router.delete('/:playlistId/remove-song', controller.removeSong);
router.post('/:playlistId/save', controller.savePlaylistToUser);

module.exports = router;
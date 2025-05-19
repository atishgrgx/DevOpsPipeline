const express = require('express');
const router = express.Router();
const playlistController = require('../controller/playlistController');

router.get('/', playlistController.getAllPlaylists);

module.exports = router;
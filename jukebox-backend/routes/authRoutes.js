const express = require('express');
const router = express.Router();
const { register, login } = require('../controller/authController');
const { spotifyLogin, spotifyCallback } = require('../controller/spotifyController');

//GET
router.get('/spotify', spotifyLogin);
router.get('/spotify/callback', spotifyCallback);

//POST
router.post('/register', register);
router.post('/login', login);

//PUT


//DELETE



module.exports = router;

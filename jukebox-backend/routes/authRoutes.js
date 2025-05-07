const express = require('express');
const router = express.Router();
const { register, login } = require('../controller/authController');

//GET

//POST
router.post('/register', register);
router.post('/login', login);

//PUT


//DELETE



module.exports = router;

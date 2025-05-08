const express = require('express');
const router = express.Router();
const { register, login } = require('../controller/authController');
const { getUser, updateUser, deleteUser} = require('../controller/userController')
const authenticate = require('../middleware/authMiddleware')

//GET
router.get('/getUserProfile', authenticate, getUser)

//POST
router.post('/register', register);
router.post('/login', login);

//PUT
router.put('/profileUpdate', authenticate, updateUser);

//DELETE
router.delete('/deteleProfile', authenticate, deleteUser);



module.exports = router;

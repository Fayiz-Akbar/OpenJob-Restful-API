const express = require('express');
const { addUser, getUserById } = require('../controllers/user.controller');

const router = express.Router();

// Route untuk /users (POST untuk menambah user baru)
router.post('/', addUser);
router.get('/:id', getUserById); 

module.exports = router;
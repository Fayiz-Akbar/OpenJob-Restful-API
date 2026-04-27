const express = require('express');
const {
  login,
  putAuthentication,
  deleteAuthentication,
} = require('../controllers/authentications.controller');

const router = express.Router();

// Route untuk /authentications
router.post('/', login);
router.put('/', putAuthentication);
router.delete('/', deleteAuthentication);

module.exports = router;
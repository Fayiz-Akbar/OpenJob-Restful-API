const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const {
  getProfile,
  getProfileApplications,
  getProfileBookmarks
} = require('../controllers/profile.controller');

const router = express.Router();

// Terapkan middleware auth untuk SEMUA route di profile
router.use(authenticate);

router.get('/', getProfile);
router.get('/applications', getProfileApplications);
router.get('/bookmarks', getProfileBookmarks);

module.exports = router;
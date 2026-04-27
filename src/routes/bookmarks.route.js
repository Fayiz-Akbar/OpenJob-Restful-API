const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const {
  addBookmark, getBookmarks, getBookmarkById, deleteBookmark
} = require('../controllers/bookmark.controller');

const router = express.Router();

// Route untuk /bookmarks (GET All)
router.get('/', authenticate, getBookmarks);

// Sisa route bookmark yang menempel di job (contoh: /jobs/:jobId/bookmark)
// akan kita pasang nanti di server.js

module.exports = router;
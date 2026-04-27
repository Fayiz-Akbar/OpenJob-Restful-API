const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const {
  addCategory, getCategories, getCategoryById, updateCategoryById, deleteCategoryById
} = require('../controllers/category.controller');

const router = express.Router();

// Route untuk /categories
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', authenticate, addCategory);
router.put('/:id', authenticate, updateCategoryById);
router.delete('/:id', authenticate, deleteCategoryById);

module.exports = router;
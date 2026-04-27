const { nanoid } = require('nanoid');
const pool = require('../db');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const { validateCategoryPayload } = require('../validator/categories.validator');

const addCategory = async (req, res, next) => {
  try {
    validateCategoryPayload(req.body);
    const id = `category-${nanoid(16)}`;

    const result = await pool.query(
      'INSERT INTO categories VALUES($1, $2) RETURNING id',
      [id, req.body.name]
    );

    res.status(201).json({ status: 'success', data: { id: result.rows[0].id } });
  } catch (error) { next(error); }
};

const getCategories = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    res.status(200).json({ status: 'success', data: { categories: result.rows } });
  } catch (error) { next(error); }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (!result.rowCount) throw new NotFoundError('Category tidak ditemukan');

    res.status(200).json({ status: 'success', data: result.rows[0] });
  } catch (error) { next(error); }
};

const updateCategoryById = async (req, res, next) => {
  try {
    validateCategoryPayload(req.body);
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE categories SET name = $1 WHERE id = $2 RETURNING id',
      [req.body.name, id]
    );
    if (!result.rowCount) throw new NotFoundError('Gagal memperbarui, category tidak ditemukan');

    res.status(200).json({ status: 'success', message: 'Category berhasil diperbarui' });
  } catch (error) { next(error); }
};

const deleteCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);
    if (!result.rowCount) throw new NotFoundError('Gagal menghapus, category tidak ditemukan');

    res.status(200).json({ status: 'success', message: 'Category berhasil dihapus' });
  } catch (error) { next(error); }
};

module.exports = { addCategory, getCategories, getCategoryById, updateCategoryById, deleteCategoryById };
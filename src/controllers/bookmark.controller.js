const { nanoid } = require('nanoid');
const pool = require('../db');
const NotFoundError = require('../exceptions/NotFoundError');

const addBookmark = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id; // Diambil dari token JWT berkat middleware auth
    const id = `bookmark-${nanoid(16)}`;

    const result = await pool.query(
      'INSERT INTO bookmarks VALUES($1, $2, $3) RETURNING id',
      [id, userId, jobId]
    );

    res.status(201).json({ status: 'success', data: { id: result.rows[0].id } });
  } catch (error) { next(error); }
};

const getBookmarks = async (req, res, next) => {
  try {
    // Sesuai kriteria: mendapatkan semua bookmark milik user yang sedang login
    const userId = req.user.id;
    const result = await pool.query('SELECT * FROM bookmarks WHERE user_id = $1', [userId]);
    res.status(200).json({ status: 'success', data: { bookmarks: result.rows } });
  } catch (error) { next(error); }
};

const getBookmarkById = async (req, res, next) => {
  try {
    const { id } = req.params; // Mengambil ID bookmark
    const result = await pool.query('SELECT * FROM bookmarks WHERE id = $1', [id]);
    if (!result.rowCount) throw new NotFoundError('Bookmark tidak ditemukan');
    res.status(200).json({ status: 'success', data: result.rows[0] });
  } catch (error) { next(error); }
};

const deleteBookmark = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    // Menghapus berdasarkan job_id dan user_id
    const result = await pool.query(
      'DELETE FROM bookmarks WHERE job_id = $1 AND user_id = $2 RETURNING id',
      [jobId, userId]
    );
    if (!result.rowCount) throw new NotFoundError('Gagal menghapus, bookmark tidak ditemukan');

    res.status(200).json({ status: 'success', message: 'Bookmark berhasil dihapus' });
  } catch (error) { next(error); }
};

module.exports = { addBookmark, getBookmarks, getBookmarkById, deleteBookmark };
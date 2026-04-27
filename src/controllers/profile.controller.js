const pool = require('../db');
const NotFoundError = require('../exceptions/NotFoundError');

const getProfile = async (req, res, next) => {
  try {
    // Ambil ID dari token JWT
    const userId = req.user.id; 
    
    // Ambil data user, tapi JANGAN sertakan password
    const result = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id = $1', 
      [userId]
    );

    if (!result.rowCount) {
      throw new NotFoundError('User tidak ditemukan');
    }

    res.status(200).json({ 
      status: 'success', 
      data: result.rows[0] 
    });
  } catch (error) { next(error); }
};

const getProfileApplications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT * FROM applications WHERE user_id = $1', [userId]);
    
    res.status(200).json({ 
      status: 'success', 
      data: { applications: result.rows } 
    });
  } catch (error) { next(error); }
};

const getProfileBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT * FROM bookmarks WHERE user_id = $1', [userId]);
    
    res.status(200).json({ 
      status: 'success', 
      data: { bookmarks: result.rows } 
    });
  } catch (error) { next(error); }
};

module.exports = { getProfile, getProfileApplications, getProfileBookmarks };
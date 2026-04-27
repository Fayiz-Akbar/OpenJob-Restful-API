const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../db');
const AuthenticationError = require('../exceptions/AuthenticationError');
const InvariantError = require('../exceptions/InvariantError');
const {
  validatePostAuthenticationPayload,
  validatePutOrDeleteAuthenticationPayload,
} = require('../validator/authentications.validator');

const login = async (req, res, next) => {
  try {
    // 1. Validasi Payload (email & password)
    validatePostAuthenticationPayload(req.body);
    const { email, password } = req.body;

    // 2. Cari user berdasarkan email
    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!userQuery.rowCount) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }
    const user = userQuery.rows[0];

    // 3. Verifikasi Password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    // 4. Buat Token (SYARAT BINTANG 5: Access Token 3 Jam)
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: '3h' }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_KEY
    );

    // 5. Simpan Refresh Token ke Database
    await pool.query('INSERT INTO authentications VALUES($1)', [refreshToken]);

    res.status(200).json({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const putAuthentication = async (req, res, next) => {
  try {
    validatePutOrDeleteAuthenticationPayload(req.body);
    const { refreshToken } = req.body;

    // 1. Cek apakah refresh token ada di database
    const tokenQuery = await pool.query('SELECT token FROM authentications WHERE token = $1', [refreshToken]);
    if (!tokenQuery.rowCount) {
      throw new InvariantError('Refresh token tidak valid');
    }

    // 2. Verifikasi signature refresh token
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
      
      // 3. Buat access token baru
      const accessToken = jwt.sign(
        { id: decoded.id },
        process.env.ACCESS_TOKEN_KEY,
        { expiresIn: '3h' }
      );

      res.status(200).json({
        status: 'success',
        data: { accessToken },
      });
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  } catch (error) {
    next(error);
  }
};

const deleteAuthentication = async (req, res, next) => {
  try {
    validatePutOrDeleteAuthenticationPayload(req.body);
    const { refreshToken } = req.body;

    // Pastikan token ada di DB sebelum dihapus
    const tokenQuery = await pool.query('SELECT token FROM authentications WHERE token = $1', [refreshToken]);
    if (!tokenQuery.rowCount) {
      throw new InvariantError('Refresh token tidak valid');
    }

    // Hapus token dari DB (Logout)
    await pool.query('DELETE FROM authentications WHERE token = $1', [refreshToken]);

    res.status(200).json({
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, putAuthentication, deleteAuthentication };
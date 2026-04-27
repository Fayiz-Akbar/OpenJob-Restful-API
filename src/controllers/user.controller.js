const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const pool = require('../db');
const InvariantError = require('../exceptions/InvariantError');
const { validateUserPayload } = require('../validator/users.validator');

const addUser = async (req, res, next) => {
  try {
    // 1. Validasi input menggunakan Joi
    validateUserPayload(req.body);
    const { name, email, password, role } = req.body;

    // 2. Cek apakah email sudah terdaftar (Unique Constraint)
    const checkEmail = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
    if (checkEmail.rowCount > 0) {
      throw new InvariantError('Gagal menambahkan user. Email sudah digunakan.');
    }

    // 3. Buat ID dan Hash Password
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Masukkan ke database
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, email, hashedPassword, role],
    };

    const result = await pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('User gagal ditambahkan');
    }

    // 5. Kembalikan response sukses 201
    res.status(201).json({
      status: 'success',
      data: {
        id: result.rows[0].id,
      },
    });
  } catch (error) {
    // Lempar error ke error.middleware.js
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const query = {
      text: 'SELECT id, name, email, role FROM users WHERE id = $1', // Kita tidak men-select password demi keamanan
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rowCount) {
      return res.status(404).json({
        status: 'failed',
        message: 'User tidak ditemukan',
      });
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};


module.exports = { addUser, getUserById };

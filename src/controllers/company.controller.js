const { nanoid } = require('nanoid');
const pool = require('../db');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const { validateCompanyPayload } = require('../validator/companies.validator');

const addCompany = async (req, res, next) => {
  try {
    validateCompanyPayload(req.body);
    const { name, location, description } = req.body;
    const id = `company-${nanoid(16)}`;

    const result = await pool.query(
      'INSERT INTO companies VALUES($1, $2, $3, $4) RETURNING id',
      [id, name, location, description]
    );

    res.status(201).json({ status: 'success', data: { id: result.rows[0].id } });
  } catch (error) { next(error); }
};

const getCompanies = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM companies');
    res.status(200).json({ status: 'success', data: { companies: result.rows } });
  } catch (error) { next(error); }
};

const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM companies WHERE id = $1', [id]);
    if (!result.rowCount) throw new NotFoundError('Company tidak ditemukan');

    res.status(200).json({ status: 'success', data: result.rows[0] });
  } catch (error) { next(error); }
};

const updateCompanyById = async (req, res, next) => {
  try {
    validateCompanyPayload(req.body);
    const { id } = req.params;
    const { name, location, description } = req.body;

    const result = await pool.query(
      'UPDATE companies SET name = $1, location = $2, description = $3 WHERE id = $4 RETURNING id',
      [name, location, description, id]
    );
    if (!result.rowCount) throw new NotFoundError('Gagal memperbarui, company tidak ditemukan');

    res.status(200).json({ status: 'success', message: 'Company berhasil diperbarui' });
  } catch (error) { next(error); }
};

const deleteCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM companies WHERE id = $1 RETURNING id', [id]);
    if (!result.rowCount) throw new NotFoundError('Gagal menghapus, company tidak ditemukan');

    res.status(200).json({ status: 'success', message: 'Company berhasil dihapus' });
  } catch (error) { next(error); }
};

module.exports = { addCompany, getCompanies, getCompanyById, updateCompanyById, deleteCompanyById };
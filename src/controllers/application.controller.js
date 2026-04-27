const { nanoid } = require('nanoid');
const pool = require('../db');
const NotFoundError = require('../exceptions/NotFoundError');
const { validateApplicationPayload, validateApplicationStatus } = require('../validator/applications.validator');

const addApplication = async (req, res, next) => {
  try {
    validateApplicationPayload(req.body);
    const { user_id, job_id, status = 'pending' } = req.body;
    const id = `app-${nanoid(16)}`;

    const result = await pool.query(
      'INSERT INTO applications VALUES($1, $2, $3, $4) RETURNING id',
      [id, user_id, job_id, status]
    );

    res.status(201).json({ status: 'success', data: { id: result.rows[0].id } });
  } catch (error) { next(error); }
};

const getApplications = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM applications');
    res.status(200).json({ status: 'success', data: { applications: result.rows } });
  } catch (error) { next(error); }
};

const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);
    if (!result.rowCount) throw new NotFoundError('Application tidak ditemukan');
    res.status(200).json({ status: 'success', data: result.rows[0] });
  } catch (error) { next(error); }
};

const getApplicationsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await pool.query('SELECT * FROM applications WHERE user_id = $1', [userId]);
    res.status(200).json({ status: 'success', data: { applications: result.rows } });
  } catch (error) { next(error); }
};

const getApplicationsByJobId = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const result = await pool.query('SELECT * FROM applications WHERE job_id = $1', [jobId]);
    res.status(200).json({ status: 'success', data: { applications: result.rows } });
  } catch (error) { next(error); }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    validateApplicationStatus(req.body);
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE applications SET status = $1 WHERE id = $2 RETURNING id',
      [status, id]
    );
    if (!result.rowCount) throw new NotFoundError('Gagal memperbarui, application tidak ditemukan');

    res.status(200).json({ status: 'success', message: 'Status application berhasil diperbarui' });
  } catch (error) { next(error); }
};

const deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM applications WHERE id = $1 RETURNING id', [id]);
    if (!result.rowCount) throw new NotFoundError('Gagal menghapus, application tidak ditemukan');
    res.status(200).json({ status: 'success', message: 'Application berhasil dihapus' });
  } catch (error) { next(error); }
};

module.exports = { addApplication, getApplications, getApplicationById, getApplicationsByUserId, getApplicationsByJobId, updateApplicationStatus, deleteApplication };
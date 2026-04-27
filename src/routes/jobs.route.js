const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const {
  addJob, getJobs, getJobById, getJobsByCompanyId, getJobsByCategoryId, updateJobById, deleteJobById
} = require('../controllers/job.controller');

const router = express.Router();

// Publik
router.get('/', getJobs);
router.get('/:id', getJobById);
router.get('/company/:companyId', getJobsByCompanyId);
router.get('/category/:categoryId', getJobsByCategoryId);

// Terproteksi (Wajib Login)
router.post('/', authenticate, addJob);
router.put('/:id', authenticate, updateJobById);
router.delete('/:id', authenticate, deleteJobById);

module.exports = router;
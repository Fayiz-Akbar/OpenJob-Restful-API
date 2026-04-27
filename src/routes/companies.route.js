const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const {
  addCompany, getCompanies, getCompanyById, updateCompanyById, deleteCompanyById
} = require('../controllers/company.controller');

const router = express.Router();

// Publik
router.get('/', getCompanies);
router.get('/:id', getCompanyById);

// Terproteksi (Wajib Login)
router.post('/', authenticate, addCompany);
router.put('/:id', authenticate, updateCompanyById);
router.delete('/:id', authenticate, deleteCompanyById);

// Sisa route company yang menempel di job (contoh: /jobs/:jobId/company)
module.exports = router;
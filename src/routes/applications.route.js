const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const {
  addApplication, getApplications, getApplicationById, getApplicationsByUserId,
  getApplicationsByJobId, updateApplicationStatus, deleteApplication
} = require('../controllers/application.controller');

const router = express.Router();

// SEMUA PROTECTED
router.use(authenticate); // Cara cepat menerapkan middleware ke semua route di bawahnya

router.post('/', addApplication);
router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.get('/user/:userId', getApplicationsByUserId);
router.get('/job/:jobId', getApplicationsByJobId);
router.put('/:id', updateApplicationStatus);
router.delete('/:id', deleteApplication);

module.exports = router;